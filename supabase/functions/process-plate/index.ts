
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createWorker } from "https://esm.sh/tesseract.js@5.0.5"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to extract license plate from text
function extractLicensePlate(text) {
  // Clean the text by removing spaces and line breaks
  const cleanText = text.replace(/\s+/g, '');
  
  // Mercosul pattern: 3 letters, 1 number, 1 letter, 2 numbers (ABC1D23)
  const mercosulPattern = /[A-Z]{3}[0-9][A-Z][0-9]{2}/;
  const mercosulMatch = cleanText.match(mercosulPattern);
  
  if (mercosulMatch) {
    return {
      plate: mercosulMatch[0],
      format: 'mercosul',
      confidence: 0.95
    };
  }
  
  // Old pattern: 3 letters, 4 numbers (ABC1234)
  const oldPattern = /[A-Z]{3}[0-9]{4}/;
  const oldMatch = cleanText.match(oldPattern);
  
  if (oldMatch) {
    return {
      plate: oldMatch[0],
      format: 'old',
      confidence: 0.92
    };
  }
  
  // If no pattern is found, return the cleaned text
  return {
    plate: cleanText.substring(0, 7).toUpperCase(),
    format: 'unknown',
    confidence: 0.7
  };
}

// Function to preprocess the image before OCR
// Since we can't use tesseract.js-utils, we'll implement a simpler version
async function preprocessImage(imageBase64) {
  try {
    // Remove the data URL header if it exists
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // Return the processed image data
    return {
      success: true,
      image: base64Data
    };
  } catch (error) {
    console.error("Error in image preprocessing:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    if (!image) {
      throw new Error('No image provided')
    }
    
    console.log("Starting image processing for license plate reading")
    
    // Preprocess the image
    const processedImage = await preprocessImage(image)
    if (!processedImage.success) {
      throw new Error(`Image preprocessing failed: ${processedImage.error}`)
    }
    
    // Configure the Tesseract OCR worker
    const worker = await createWorker({
      logger: progress => console.log(progress),
    });
    
    // Load and configure the worker for character recognition
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // Optimized settings for license plates
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      tessedit_pageseg_mode: '7', // Treating the image as a single line of text
    });
    
    console.log("OCR configured, starting text recognition")
    
    // Recognize text in the image
    const result = await worker.recognize(image);
    console.log("Recognized text:", result.data.text);
    
    // Extract license plate from recognized text
    const plateInfo = extractLicensePlate(result.data.text);
    console.log("Extracted license plate information:", plateInfo);
    
    // Release worker resources
    await worker.terminate();
    
    return new Response(
      JSON.stringify({
        plate: plateInfo.plate,
        confidence: plateInfo.confidence,
        format: plateInfo.format
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error processing license plate:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
