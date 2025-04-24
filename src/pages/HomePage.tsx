import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Clock, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
export default function HomePage() {
  return <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-anpr-blue text-white rounded-lg overflow-hidden shadow-lg">
        <div className="bg-[url('https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] bg-cover bg-center bg-opacity-50 bg-blend-overlay">
          <div className="backdrop-blur-sm bg-anpr-darkBlue/40 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Tecnologia ANPR para Cidades Inteligentes
            </h1>
            <p className="mt-4 text-lg md:w-3/4">
              Conheça como a tecnologia de reconhecimento automático de placas está transformando a gestão de tráfego
              e a segurança das cidades modernas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button className="bg-white text-anpr-darkBlue hover:bg-gray-100">
                  Ver Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/plate-reader">
                <Button variant="outline" className="border-white text-white bg-slate-800 hover:bg-slate-700">
                  Testar Leitor ANPR
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is ANPR Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">O que é tecnologia ANPR?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-3">Reconhecimento Automático de Placas</h3>
              <p className="text-gray-600">
                ANPR (Automatic Number Plate Recognition) é uma tecnologia que utiliza reconhecimento óptico de caracteres
                em imagens para identificar placas de veículos. Câmeras especializadas capturam imagens de veículos e
                algoritmos processam essas imagens para extrair os caracteres das placas.
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-3">Integração com Smart Cities</h3>
              <p className="text-gray-600">
                Em cidades inteligentes, os sistemas ANPR são integrados a redes de câmeras urbanas e sistemas centralizados
                de gerenciamento de tráfego. Isso permite monitoramento em tempo real, automação de processos como fiscalização
                e coleta de dados para análise de fluxo e planejamento urbano.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Benefícios Econômicos e Operacionais</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-anpr-lightGray rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-anpr-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2">Redução de Custos</h3>
              <p className="text-gray-600">
                Economia de até 60% em custos com fiscalização manual, reduzindo a necessidade de pessoal em campo e otimizando recursos.
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-anpr-lightGray rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-anpr-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2">Eficiência de Tempo</h3>
              <p className="text-gray-600">
                Processamento instantâneo de informações, eliminando atrasos e burocracia na identificação e registro de veículos.
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-anpr-lightGray rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-anpr-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aumento da Segurança</h3>
              <p className="text-gray-600">
                Monitoramento 24/7 do fluxo de caminhões, identificação imediata de veículos não autorizados e prevenção de infrações.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Métricas de Impacto</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-anpr-blue">60%</div>
              <p className="text-sm text-gray-600 mt-1">Redução de Custos Operacionais</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-anpr-blue">95%</div>
              <p className="text-sm text-gray-600 mt-1">Precisão na Leitura de Placas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-anpr-blue">85%</div>
              <p className="text-sm text-gray-600 mt-1">Aumento na Eficiência</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-anpr-blue">24/7</div>
              <p className="text-sm text-gray-600 mt-1">Monitoramento Contínuo</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Retorno sobre Investimento</h3>
            <div className="bg-gray-100 h-3 rounded-full w-full">
              <div className="bg-anpr-blue h-3 rounded-full" style={{
              width: '78%'
            }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Investimento Inicial</span>
              <span>78% de retorno em 12 meses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Como Funciona a Tecnologia</h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6">
              <h3 className="text-xl font-medium mb-3">Sistema Integrado</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-anpr-lightGray p-1 rounded-full mr-3 mt-1">
                    <BarChart3 className="h-4 w-4 text-anpr-blue" />
                  </span>
                  <span>
                    <strong className="font-medium">Captura de imagem</strong>
                    <p className="text-gray-600 text-sm">Câmeras de alta resolução capturam imagens dos veículos</p>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-anpr-lightGray p-1 rounded-full mr-3 mt-1">
                    <TrendingUp className="h-4 w-4 text-anpr-blue" />
                  </span>
                  <span>
                    <strong className="font-medium">Processamento OCR</strong>
                    <p className="text-gray-600 text-sm">Algoritmos de reconhecimento óptico de caracteres identificam e extraem o texto da placa</p>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-anpr-lightGray p-1 rounded-full mr-3 mt-1">
                    <Clock className="h-4 w-4 text-anpr-blue" />
                  </span>
                  <span>
                    <strong className="font-medium">Validação e Registro</strong>
                    <p className="text-gray-600 text-sm">O sistema valida a placa e registra a entrada ou saída do veículo no banco de dados</p>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-anpr-lightGray p-1 rounded-full mr-3 mt-1">
                    <ShieldCheck className="h-4 w-4 text-anpr-blue" />
                  </span>
                  <span>
                    <strong className="font-medium">Alertas e Relatórios</strong>
                    <p className="text-gray-600 text-sm">Geração automática de alertas e relatórios com base nos critérios definidos</p>
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-anpr-lightGray flex items-center justify-center p-6">
              <img src="https://images.unsplash.com/photo-1605789538467-f715d58e03f9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80" alt="Câmera ANPR em funcionamento" className="rounded-lg shadow-md max-h-64 object-cover" />
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-anpr-darkBlue to-anpr-blue rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Transforme sua gestão de tráfego urbano</h2>
        <p className="mb-6 md:w-3/4 mx-auto">
          Monitore o fluxo de caminhões em tempo real, tenha acesso a relatórios detalhados e aumente a segurança da sua cidade.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/dashboard">
            <Button className="bg-white text-anpr-blue hover:bg-gray-100">
              Acessar Dashboard
            </Button>
          </Link>
          <Link to="/plate-reader">
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Testar Leitor ANPR
            </Button>
          </Link>
        </div>
      </section>
    </div>;
}