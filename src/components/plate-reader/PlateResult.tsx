
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";
import { Check, RefreshCw } from "lucide-react";

interface PlateResultProps {
  isProcessed: boolean;
  plateText: string;
  confidence: number;
  onReprocess: () => void;
  onRegister: () => void;
}

export const PlateResult = ({
  isProcessed,
  plateText,
  confidence,
  onReprocess,
  onRegister,
}: PlateResultProps) => {
  return (
    <>
      <CardContent className="space-y-4">
        {isProcessed ? (
          <>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Placa Identificada</p>
              <h2 className="text-4xl font-bold tracking-wider">{plateText}</h2>
              <div className="mt-2 text-sm text-gray-500">
                Confiança: {confidence}%
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${confidence > 90 ? 'bg-green-500' : confidence > 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={onReprocess}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reprocessar
              </Button>
              <Button 
                className="flex-1 bg-anpr-blue hover:bg-anpr-darkBlue"
                onClick={onRegister}
              >
                <Check className="mr-2 h-4 w-4" />
                Registrar
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              Nenhuma placa processada
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Faça o upload de uma imagem e clique em "Processar Imagem"
            </p>
          </div>
        )}
      </CardContent>
      
      {isProcessed && (
        <Alert className="bg-blue-50 border-blue-100">
          <AlertTitle className="text-blue-800">Dica</AlertTitle>
          <AlertDescription className="text-blue-700">
            Você pode registrar esta placa para rastrear a entrada e saída do caminhão na cidade.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
