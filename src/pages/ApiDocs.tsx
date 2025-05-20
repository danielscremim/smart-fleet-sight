import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    // Carregar o arquivo swagger.json
    fetch('/api-docs/swagger.json')
      .then(response => response.json())
      .then(data => setSwaggerSpec(data))
      .catch(error => console.error('Erro ao carregar a documentação da API:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Documentação da API</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {swaggerSpec ? (
          <SwaggerUI spec={swaggerSpec} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anpr-blue"></div>
          </div>
        )}
      </div>
    </div>
  );
}