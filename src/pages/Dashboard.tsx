import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  Car, 
  Check,
  Clock, 
  Filter, 
  MapPin, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  Truck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

// Dados de exemplo
const vehicleTypeData = [
  { name: 'Carros', value: 45, color: '#1F75FE' },
  { name: 'Caminhões', value: 25, color: '#36A2EB' },
  { name: 'Vans', value: 15, color: '#4BC0C0' },
  { name: 'Motos', value: 10, color: '#9966FF' },
  { name: 'Ônibus', value: 5, color: '#FF9F40' },
];

const weeklyActivityData = [
  { name: 'Seg', entradas: 12, saidas: 10 },
  { name: 'Ter', entradas: 19, saidas: 15 },
  { name: 'Qua', entradas: 15, saidas: 12 },
  { name: 'Qui', entradas: 22, saidas: 20 },
  { name: 'Sex', entradas: 28, saidas: 25 },
  { name: 'Sáb', entradas: 10, saidas: 8 },
  { name: 'Dom', entradas: 5, saidas: 4 },
];

const hourlyData = [
  { hora: '00:00', veiculos: 2 },
  { hora: '02:00', veiculos: 1 },
  { hora: '04:00', veiculos: 0 },
  { hora: '06:00', veiculos: 5 },
  { hora: '08:00', veiculos: 15 },
  { hora: '10:00', veiculos: 12 },
  { hora: '12:00', veiculos: 10 },
  { hora: '14:00', veiculos: 13 },
  { hora: '16:00', veiculos: 18 },
  { hora: '18:00', veiculos: 20 },
  { hora: '20:00', veiculos: 8 },
  { hora: '22:00', veiculos: 4 },
];

const recentVehicles = [
  { id: 1, plate: 'ABC1234', type: 'car', time: '10:45', status: 'entrada', location: 'Portão Principal' },
  { id: 2, plate: 'XYZ9876', type: 'truck', time: '10:30', status: 'saída', location: 'Portão de Carga' },
  { id: 3, plate: 'DEF5678', type: 'car', time: '10:15', status: 'entrada', location: 'Portão Lateral' },
  { id: 4, plate: 'GHI9012', type: 'van', time: '10:00', status: 'entrada', location: 'Portão Principal' },
  { id: 5, plate: 'JKL3456', type: 'motorcycle', time: '09:45', status: 'saída', location: 'Portão de Funcionários' },
];

const alerts = [
  { id: 1, plate: 'MNO7890', message: 'Veículo não autorizado', time: '10:22', severity: 'high' },
  { id: 2, plate: 'PQR2345', message: 'Tempo de permanência excedido', time: '09:15', severity: 'medium' },
  { id: 3, plate: 'STU6789', message: 'Veículo em área restrita', time: '08:30', severity: 'high' },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  // Altere esta linha para iniciar com a aba de alertas selecionada
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    // Simulando carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Background grid animation */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(#1F75FE 1px, transparent 1px)`, 
          backgroundSize: '50px 50px' 
        }}></div>
        
        <motion.div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `radial-gradient(#1F75FE 1px, transparent 1px)`, 
            backgroundSize: '50px 50px' 
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        ></motion.div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Monitoramento em tempo real da sua frota</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar placa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 w-full sm:w-[200px]"
              />
            </div>
            
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-full sm:w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="border-slate-700 text-white hover:bg-slate-700"
              onClick={refreshData}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#1F75FE] data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#1F75FE] data-[state=active]:text-white">
              Atividade
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#1F75FE] data-[state=active]:text-white">
              Alertas
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      title: 'Total de Veículos', 
                      value: '124', 
                      change: '+12%', 
                      icon: <Car className="h-5 w-5 text-[#1F75FE]" /> 
                    },
                    { 
                      title: 'Entradas Hoje', 
                      value: '45', 
                      change: '+8%', 
                      icon: <ArrowUpRight className="h-5 w-5 text-emerald-500" /> 
                    },
                    { 
                      title: 'Tempo Médio', 
                      value: '2.5h', 
                      change: '-15%', 
                      icon: <Clock className="h-5 w-5 text-amber-500" /> 
                    },
                    { 
                      title: 'Alertas', 
                      value: '3', 
                      change: '+2', 
                      icon: <AlertTriangle className="h-5 w-5 text-rose-500" /> 
                    },
                  ].map((stat, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">{stat.title}</CardTitle>
                          <div className="p-2 rounded-full bg-slate-700/50">{stat.icon}</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline space-x-3">
                          <div className="text-3xl font-bold text-white">{stat.value}</div>
                          <div className={`text-sm ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {stat.change}
                          </div>
                        </div>
                      </CardContent>
                      
                      {/* Animated gradient border */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1F75FE] via-blue-400 to-[#1F75FE] background-animate"></div>
                    </Card>
                  ))}
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm lg:col-span-2">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Atividade Semanal</CardTitle>
                          <CardDescription>Entradas e saídas de veículos</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        {isLoading ? (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F75FE]"></div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="name" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                                itemStyle={{ color: '#F9FAFB' }}
                                labelStyle={{ color: '#F9FAFB' }}
                              />
                              <Legend />
                              <Bar dataKey="entradas" fill="#1F75FE" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="saidas" fill="#4BC0C0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Tipos de Veículos</CardTitle>
                          <CardDescription>Distribuição por categoria</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Filter className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        {isLoading ? (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F75FE]"></div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={vehicleTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {vehicleTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                                itemStyle={{ color: '#F9FAFB' }}
                                labelStyle={{ color: '#F9FAFB' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Vehicles */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Veículos Recentes</CardTitle>
                        <CardDescription>Últimos registros de entrada e saída</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-700">
                        Ver Todos
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Placa</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Tipo</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Horário</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Local</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            [...Array(5)].map((_, index) => (
                              <tr key={index} className="border-b border-slate-700/50">
                                <td colSpan={5} className="py-3 px-4">
                                  <div className="h-6 bg-slate-700/50 rounded animate-pulse"></div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            recentVehicles.map((vehicle) => (
                              <tr key={vehicle.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                                <td className="py-3 px-4 text-white font-medium">{vehicle.plate}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    {vehicle.type === 'car' ? (
                                      <Car className="h-4 w-4 text-[#1F75FE] mr-2" />
                                    ) : vehicle.type === 'truck' ? (
                                      <Truck className="h-4 w-4 text-[#36A2EB] mr-2" />
                                    ) : (
                                      <Truck className="h-4 w-4 text-[#4BC0C0] mr-2" />
                                    )}
                                    <span className="text-gray-300 capitalize">{vehicle.type}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{vehicle.time}</td>
                                <td className="py-3 px-4">
                                  <Badge variant={vehicle.status === 'entrada' ? 'default' : 'secondary'} className={vehicle.status === 'entrada' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'}>
                                    {vehicle.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center text-gray-300">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                    {vehicle.location}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Atividade por Hora</CardTitle>
                          <CardDescription>Fluxo de veículos nas últimas 24 horas</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Calendar className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        {isLoading ? (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F75FE]"></div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="hora" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                                itemStyle={{ color: '#F9FAFB' }}
                                labelStyle={{ color: '#F9FAFB' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="veiculos" 
                                stroke="#1F75FE" 
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#1F75FE', strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#1F75FE', stroke: '#fff', strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Atividade por Local</CardTitle>
                          <CardDescription>Distribuição de entradas por portão</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading ? (
                          [...Array(4)].map((_, index) => (
                            <div key={index} className="space-y-2">
                              <div className="h-5 bg-slate-700/50 rounded w-1/3 animate-pulse"></div>
                              <div className="h-8 bg-slate-700/50 rounded animate-pulse"></div>
                            </div>
                          ))
                        ) : (
                          [
                            { name: 'Portão Principal', value: 65, color: '#1F75FE' },
                            { name: 'Portão de Carga', value: 25, color: '#36A2EB' },
                            { name: 'Portão Lateral', value: 15, color: '#4BC0C0' },
                            { name: 'Portão de Funcionários', value: 10, color: '#9966FF' },
                          ].map((item, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">{item.name}</span>
                                <span className="text-white font-medium">{item.value}%</span>
                              </div>
                              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.value}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                ></motion.div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Histórico de Atividades</CardTitle>
                        <CardDescription>Registro detalhado de entradas e saídas</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-700">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtrar
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-700">
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {isLoading ? (
                        [...Array(5)].map((_, index) => (
                          <div key={index} className="h-20 bg-slate-700/50 rounded animate-pulse"></div>
                        ))
                      ) : (
                        [...Array(10)].map((_, index) => {
                          const isEntry = index % 2 === 0;
                          return (
                            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                              <div className={`p-3 rounded-full ${isEntry ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                                {isEntry ? (
                                  <ArrowUpRight className={`h-5 w-5 ${isEntry ? 'text-emerald-500' : 'text-amber-500'}`} />
                                ) : (
                                  <ArrowUpRight className="h-5 w-5 text-amber-500 transform rotate-90" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="text-white font-medium">
                                    {isEntry ? 'Entrada Registrada' : 'Saída Registrada'}
                                  </h4>
                                  <span className="text-gray-400 text-sm">
                                    {new Date(Date.now() - index * 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-gray-400 mt-1">
                                  Veículo <span className="text-white font-medium">
                                    {['ABC1234', 'XYZ9876', 'DEF5678', 'GHI9012', 'JKL3456'][index % 5]}
                                  </span> {isEntry ? 'entrou por' : 'saiu por'} {['Portão Principal', 'Portão de Carga', 'Portão Lateral'][index % 3]}
                                </p>
                                <div className="flex items-center mt-2">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${index}`} />
                                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                                      {['JD', 'MS', 'AL', 'RB', 'TK'][index % 5]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-gray-400 text-sm">
                                    Registrado por {['João', 'Maria', 'Alex', 'Roberto', 'Tiago'][index % 5]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="alerts" className="space-y-6 mt-0">
                <div className="p-4 bg-slate-800 text-white rounded-lg">
                  <h2>Conteúdo da Aba de Alertas</h2>
                  <p>Esta é uma versão simplificada para teste.</p>
                </div>
              </TabsContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { title: 'Alertas Críticos', value: '2', icon: <AlertTriangle className="h-5 w-5 text-rose-500" />, color: 'rose' },
                    { title: 'Alertas Médios', value: '1', icon: <AlertTriangle className="h-5 w-5 text-amber-500" />, color: 'amber' },
                    { title: 'Alertas Resolvidos', value: '8', icon: <Check className="h-5 w-5 text-emerald-500" />, color: 'emerald' },
                  ].map((stat, index) => (
                    <Card key={index} className={`backdrop-blur-sm ${
                      stat.color === 'rose' ? 'bg-rose-500/10 border-rose-500/20' :
                      stat.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">{stat.title}</CardTitle>
                          <div className={`p-2 rounded-full ${
                            stat.color === 'rose' ? 'bg-rose-500/20' :
                            stat.color === 'amber' ? 'bg-amber-500/20' :
                            'bg-emerald-500/20'
                          }`}>{stat.icon}</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Alertas Ativos</CardTitle>
                        <CardDescription>Situações que requerem atenção</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-700">
                        Marcar Todos como Lidos
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        [...Array(3)].map((_, index) => (
                          <div key={index} className="h-24 bg-slate-700/50 rounded animate-pulse"></div>
                        ))
                      ) : (
                        alerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-4 rounded-lg border ${
                              alert.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="text-white font-medium">{alert.message}</h4>
                                  <Badge variant="outline" className={`${
                                    alert.severity === 'high' ? 'border-rose-500 text-rose-500' : 'border-amber-500 text-amber-500'
                                  }`}>
                                    {alert.severity === 'high' ? 'Crítico' : 'Médio'}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 mt-1">
                                  Veículo <span className="text-white font-medium">{alert.plate}</span>
                                </p>
                                <div className="flex justify-between items-center mt-3">
                                  <span className="text-gray-400 text-sm">{alert.time}</span>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white">
                                      Ignorar
                                    </Button>
                                    <Button size="sm" className="h-8 px-3 bg-[#1F75FE] hover:bg-blue-600">
                                      Resolver
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Veículos em Lista de Restrição</CardTitle>
                          <CardDescription>Veículos com acesso limitado ou bloqueado</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading ? (
                          [...Array(3)].map((_, index) => (
                            <div key={index} className="h-16 bg-slate-700/50 rounded animate-pulse"></div>
                          ))
                        ) : (
                          [
                            { plate: 'VWX4567', reason: 'Acesso expirado', status: 'blocked' },
                            { plate: 'YZA7890', reason: 'Veículo suspeito', status: 'restricted' },
                            { plate: 'BCD1234', reason: 'Pendência administrativa', status: 'restricted' },
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-full ${
                                  item.status === 'blocked' ? 'bg-rose-500/20' : 'bg-amber-500/20'
                                }`}>
                                  {item.status === 'blocked' ? (
                                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <div className="text-white font-medium">{item.plate}</div>
                                  <div className="text-gray-400 text-sm">{item.reason}</div>
                                </div>
                              </div>
                              <Badge variant="outline" className={`${
                                item.status === 'blocked' ? 'border-rose-500 text-rose-500' : 'border-amber-500 text-amber-500'
                              }`}>
                                {item.status === 'blocked' ? 'Bloqueado' : 'Restrito'}
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Configurações de Alerta</CardTitle>
                          <CardDescription>Personalizar notificações e limites</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { title: 'Notificações de Alerta', description: 'Receber alertas em tempo real', enabled: true },
                          { title: 'Limite de Tempo de Permanência', description: 'Alertar quando veículos excederem o tempo', enabled: true },
                          { title: 'Detecção de Veículos Não Autorizados', description: 'Alertar sobre veículos sem permissão', enabled: true },
                          { title: 'Alertas de Área Restrita', description: 'Monitorar acesso a áreas restritas', enabled: false },
                        ].map((setting, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="text-white font-medium">{setting.title}</h4>
                              <p className="text-gray-400 text-sm">{setting.description}</p>
                            </div>
                            <Switch checked={setting.enabled} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Não registrado";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Placa</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Último Registro</TableHead>
      <TableHead>Entrando</TableHead>
      <TableHead>Na Cidade</TableHead>
      <TableHead>Saindo</TableHead>
      <TableHead>Fora da Cidade</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {trucks.map((truck) => (
      <TableRow key={truck.id}>
        <TableCell className="font-medium">{truck.plate}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(truck.status)}>
            {getStatusLabel(truck.status)}
          </Badge>
        </TableCell>
        <TableCell>{formatDateTime(truck.last_seen)}</TableCell>
        <TableCell>{formatDateTime(truck.status_timestamps?.entering)}</TableCell>
        <TableCell>{formatDateTime(truck.status_timestamps?.in_city)}</TableCell>
        <TableCell>{formatDateTime(truck.status_timestamps?.leaving)}</TableCell>
        <TableCell>{formatDateTime(truck.status_timestamps?.outside)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>