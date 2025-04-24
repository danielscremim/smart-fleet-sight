
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PlateInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Como utilizar o leitor ANPR</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-3 text-gray-600">
          <li>Faça upload da foto de uma placa de caminhão (formatos aceitos: JPG, PNG).</li>
          <li>Clique em "Processar Imagem" para iniciar o reconhecimento automático.</li>
          <li>Verifique o resultado da leitura e o nível de confiança.</li>
          <li>Se necessário, clique em "Reprocessar" para tentar novamente.</li>
          <li>Quando o resultado estiver correto, clique em "Registrar" para adicionar ao sistema.</li>
        </ol>
      </CardContent>
    </Card>
  );
};
