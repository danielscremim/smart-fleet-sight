
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, TruckIcon, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTrucks, TruckStatus } from "@/contexts/TruckContext";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardPage() {
  const { 
    trucks,
    loading,
    error,
    stats,
    refreshTrucks,
    updateTruckStatus
  } = useTrucks();

  // Atualizar dados ao carregar a página
  useEffect(() => {
    refreshTrucks();
  }, []); // Remova refreshTrucks da dependência

  // Function to get status label
  const getStatusLabel = (status: Truck['status']): string => {
    switch (status) {
      case "entering": return "Entrando";
      case "in_city": return "Na cidade";
      case "leaving": return "Saindo";
      case "outside": return "Fora";
      default: return "";
    }
  };

  // Function to get status color
  const getStatusColor = (status: Truck['status']): string => {
    switch (status) {
      case "entering": return "text-blue-500";
      case "in_city": return "text-amber-500";
      case "leaving": return "text-orange-500";
      case "outside": return "text-green-500";
      default: return "";
    }
  };

  // Format timestamp
  const formatTimestamp = (dateStr: string | null): string => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Chart data
  const statusCounts = {
    entering: stats?.entering || 0,
    in_city: stats?.in_city || 0,
    leaving: stats?.leaving || 0,
    outside: stats?.outside || 0
  };

  const pieData = [
    { name: "Entrando", value: statusCounts.entering, color: "#2196F3" },
    { name: "Na cidade", value: statusCounts.in_city, color: "#FFC107" },
    { name: "Saindo", value: statusCounts.leaving, color: "#FF9800" },
    { name: "Fora", value: statusCounts.outside, color: "#4CAF50" }
  ];

  // Dados para o gráfico de barras
  const barData = [
    { name: "Segunda", entering: 4, inside: 6, exited: 2 },
    { name: "Terça", entering: 3, inside: 7, exited: 5 },
    { name: "Quarta", entering: 5, inside: 9, exited: 3 },
    { name: "Quinta", entering: 7, inside: 10, exited: 4 },
    { name: "Sexta", entering: 6, inside: 8, exited: 7 },
    { name: "Sábado", entering: 2, inside: 4, exited: 3 },
    { name: "Domingo", entering: 1, inside: 2, exited: 1 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Caminhões</h1>
          <p className="text-gray-500">Monitore o fluxo de caminhões na cidade</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Botão de atualizar */}
          <Button 
            variant="outline" 
            onClick={() => refreshTrucks()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caminhões Entrando</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.entering}</div>
            <p className="text-xs text-gray-500">
              Caminhões entrando na cidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caminhões na Cidade</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Truck className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.in_city}</div>
            <p className="text-xs text-gray-500">
              Caminhões que estão na cidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caminhões Saindo</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.leaving}</div>
            <p className="text-xs text-gray-500">
              Caminhões saindo da cidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caminhões Fora</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.outside}</div>
            <p className="text-xs text-gray-500">
              Caminhões fora da cidade
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividade por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entering" name="Entrando" fill="#2196F3" />
                <Bar dataKey="inside" name="Na cidade" fill="#FFC107" />
                <Bar dataKey="exited" name="Saíram" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      
      {/* Trucks list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Caminhões ({trucks?.length || 0})</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : trucks && trucks.length > 0 ? (
                  trucks.map((truck) => (
                    <tr key={truck.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {truck.plate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center ${getStatusColor(truck.status)}`}>
                          <span className={`h-2 w-2 rounded-full mr-2 bg-current`}></span>
                          {getStatusLabel(truck.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {truck.model || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(truck.last_seen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => {
                            const nextStatus = getNextStatus(truck.status);
                            updateTruckStatus(truck.id, nextStatus);
                          }}
                        >
                          Atualizar Status
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      {error ? `Erro ao carregar dados: ${error}` : "Nenhum caminhão encontrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Função auxiliar para determinar o próximo status
function getNextStatus(currentStatus: Truck['status']): Truck['status'] {
  switch (currentStatus) {
    case "entering": return "in_city";
    case "in_city": return "leaving";
    case "leaving": return "outside";
    case "outside": return "entering";
    default: return "entering";
  }
}
