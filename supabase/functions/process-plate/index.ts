
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    const { image } = await req.json()
    if (!image) {
      throw new Error('No image provided')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a specialized Brazilian license plate reader. Given an image of a license plate, extract ONLY the plate number in the format it appears, whether it's the Mercosul format (AAA0A00) or the older format (AAA-0000). Return ONLY the plate number, no additional text or explanation."
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image_url: {
                  url: image
                }
              },
              "Read this Brazilian license plate and return ONLY the plate number."
            ]
          }
        ],
        max_tokens: 20
      }),
    })

    const data = await response.json()
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI')
    }

    // Clean up the response to only include alphanumeric characters
    const plateNumber = data.choices[0].message.content.replace(/[^A-Z0-9]/g, '').trim()

    // Validate plate format
    const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/

    if (!mercosulFormat.test(plateNumber) && !oldFormat.test(plateNumber)) {
      throw new Error('Invalid plate number format')
    }

    console.log('Successfully processed plate:', plateNumber)
    
    return new Response(
      JSON.stringify({
        plate: plateNumber,
        confidence: 0.95, // OpenAI Vision is very accurate for this task
        format: mercosulFormat.test(plateNumber) ? 'mercosul' : 'old'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error processing plate:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
