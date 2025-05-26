import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useNavigate } from 'react-router-dom';

export default function ApiDocs() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar o arquivo swagger.json
    fetch('/api-docs/swagger.json')
      .then(response => response.json())
      .then(data => setSwaggerSpec(data))
      .catch(error => console.error('Erro ao carregar a documentação da API:', error));
  }, []);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documentação da API</h1>
        <button 
          onClick={handleGoBack}
          className="bg-anpr-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para a Home
        </button>
      </div>
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