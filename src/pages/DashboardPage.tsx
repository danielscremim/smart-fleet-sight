
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, TruckIcon, ArrowRight, ArrowLeft } from "lucide-react";
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

export default function DashboardPage() {
  const { 
    filteredTrucks, 
    currentPeriod, 
    setCurrentPeriod, 
    currentStatusFilter,
    setCurrentStatusFilter,
    updateTruckStatus
  } = useTrucks();

  // Function to get status label
  const getStatusLabel = (status: TruckStatus): string => {
    switch (status) {
      case "entering": return "Entrando";
      case "inside": return "Na cidade";
      case "exited": return "Saiu";
      default: return "";
    }
  };

  // Function to get next status
  const getNextStatus = (currentStatus: TruckStatus): TruckStatus => {
    switch (currentStatus) {
      case "entering": return "inside";
      case "inside": return "exited";
      case "exited": return "entering";
      default: return "entering";
    }
  };

  // Function to get status color
  const getStatusColor = (status: TruckStatus): string => {
    switch (status) {
      case "entering": return "text-status-entering";
      case "inside": return "text-status-inside";
      case "exited": return "text-status-exited";
      default: return "";
    }
  };

  // Format timestamp
  const formatTimestamp = (date: Date | null): string => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Chart data
  const statusCounts = {
    entering: filteredTrucks.filter(t => t.currentStatus === "entering").length,
    inside: filteredTrucks.filter(t => t.currentStatus === "inside").length,
    exited: filteredTrucks.filter(t => t.currentStatus === "exited").length
  };

  const pieData = [
    { name: "Entrando", value: statusCounts.entering, color: "#2196F3" },
    { name: "Na cidade", value: statusCounts.inside, color: "#FFC107" },
    { name: "Saíram", value: statusCounts.exited, color: "#4CAF50" }
  ];

  // Data for bar chart (mock data - in a real app, this would be based on actual historical data)
  const barData = [
    { name: "Seg", entering: 15, inside: 28, exited: 22 },
    { name: "Ter", entering: 18, inside: 32, exited: 24 },
    { name: "Qua", entering: 22, inside: 35, exited: 28 },
    { name: "Qui", entering: 25, inside: 30, exited: 27 },
    { name: "Sex", entering: 30, inside: 40, exited: 35 },
    { name: "Sab", entering: 12, inside: 20, exited: 18 },
    { name: "Dom", entering: 8, inside: 15, exited: 12 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Caminhões</h1>
          <p className="text-gray-500">Monitore o fluxo de caminhões na cidade</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Period tabs */}
          <Tabs value={currentPeriod} onValueChange={(v: any) => setCurrentPeriod(v)}>
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Status filter */}
          <Tabs value={currentStatusFilter} onValueChange={(v: any) => setCurrentStatusFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="entering">Entrando</TabsTrigger>
              <TabsTrigger value="inside">Na cidade</TabsTrigger>
              <TabsTrigger value="exited">Saíram</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Caminhões que ainda entrarão na cidade
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
            <div className="text-3xl font-bold">{statusCounts.inside}</div>
            <p className="text-xs text-gray-500">
              Caminhões que já entraram e estão na cidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Caminhões que Saíram</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusCounts.exited}</div>
            <p className="text-xs text-gray-500">
              Caminhões que já saíram da cidade
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
            <CardTitle>Fluxo Semanal</CardTitle>
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
        <h2 className="text-xl font-semibold mb-4">Lista de Caminhões ({filteredTrucks.length})</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saída</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTrucks.length > 0 ? (
                  filteredTrucks.map((truck) => (
                    <tr key={truck.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {truck.licensePlate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center ${getStatusColor(truck.currentStatus)}`}>
                          <span className={`status-dot status-dot-${truck.currentStatus}`}></span>
                          {getStatusLabel(truck.currentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(truck.entryTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(truck.exitTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => updateTruckStatus(truck.id, getNextStatus(truck.currentStatus))}
                        >
                          Alterar para {getStatusLabel(getNextStatus(truck.currentStatus))}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum caminhão encontrado no período selecionado.
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
