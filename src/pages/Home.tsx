import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Shield, Truck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/10"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [Math.random() * 100, Math.random() * -100],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 mx-auto px-4 py-32 text-center sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">Monitoramento Inteligente</span>
            <span className="block text-[#1F75FE]">para sua Frota</span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto mt-6 max-w-xl text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Otimize operações, reduza custos e aumente a segurança com nossa plataforma avançada de reconhecimento de placas e gestão de frota.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-[#1F75FE] hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50"
              onClick={() => navigate('/register')}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-[#1F75FE] hover:bg-white/10 px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate('/login')}
            >
              Fazer Login
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Recursos Avançados</h2>
            <div className="mt-2 h-1 w-20 bg-[#1F75FE] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Truck className="h-10 w-10 text-[#1F75FE]" />,
                title: "Reconhecimento Automático",
                description: "Identifique veículos instantaneamente com nossa tecnologia avançada de reconhecimento de placas."
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-[#1F75FE]" />,
                title: "Análise em Tempo Real",
                description: "Visualize dados e estatísticas da sua frota em tempo real com dashboards interativos."
              },
              {
                icon: <Shield className="h-10 w-10 text-[#1F75FE]" />,
                title: "Segurança Avançada",
                description: "Proteja sua frota com alertas instantâneos e monitoramento contínuo de atividades suspeitas."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-slate-800/50 backdrop-blur-sm p-8 border border-slate-700 hover:border-[#1F75FE]/50 transition-all"
                whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(31, 117, 254, 0.3)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pronto para transformar a gestão da sua frota?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Junte-se a centenas de empresas que já otimizaram suas operações com o Smart Fleet Sight.
            </p>
            <Button 
              size="lg" 
              className="bg-[#1F75FE] hover:bg-blue-600 text-white px-10 py-6 text-lg rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50"
              onClick={() => navigate('/register')}
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">Smart Fleet Sight</h2>
              <p className="text-gray-400 mt-2">Monitoramento inteligente para sua frota</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#1F75FE]">Sobre</a>
              <a href="#" className="text-gray-400 hover:text-[#1F75FE]">Recursos</a>
              <a href="#" className="text-gray-400 hover:text-[#1F75FE]">Preços</a>
              <a href="#" className="text-gray-400 hover:text-[#1F75FE]">Contato</a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Smart Fleet Sight. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}