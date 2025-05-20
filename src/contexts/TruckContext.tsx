
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Truck, TruckInput } from '@/types/truck';
import { truckService } from '@/services/truckService';
import { useToast } from '@/components/ui/use-toast';

interface TruckContextType {
  trucks: Truck[];
  loading: boolean;
  error: string | null;
  stats: Record<Truck['status'], number>;
  refreshTrucks: () => Promise<void>;
  getTruckByPlate: (plate: string) => Promise<Truck | null>;
  createTruck: (truck: TruckInput) => Promise<Truck>;
  updateTruck: (id: string, truck: Partial<TruckInput>) => Promise<Truck>;
  updateTruckStatus: (id: string, status: Truck['status']) => Promise<Truck>;
  deleteTruck: (id: string) => Promise<void>;
}

const TruckContext = createContext<TruckContextType | undefined>(undefined);

export const TruckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [stats, setStats] = useState<Record<Truck['status'], number>>({
    entering: 0,
    in_city: 0,
    leaving: 0,
    outside: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshTrucks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trucksData, statsData] = await Promise.all([
        truckService.getAllTrucks(),
        truckService.getTruckStats()
      ]);
      
      setTrucks(trucksData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de caminhões';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTrucks();
  }, []);

  const getTruckByPlate = async (plate: string) => {
    try {
      return await truckService.getTruckByPlate(plate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar caminhão';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  };

  const createTruck = async (truck: TruckInput) => {
    try {
      const newTruck = await truckService.createTruck(truck);
      await refreshTrucks();
      toast({
        title: 'Sucesso',
        description: `Caminhão ${newTruck.plate} adicionado com sucesso!`,
      });
      return newTruck;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar caminhão';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateTruck = async (id: string, truck: Partial<TruckInput>) => {
    try {
      const updatedTruck = await truckService.updateTruck(id, truck);
      await refreshTrucks();
      toast({
        title: 'Sucesso',
        description: `Caminhão ${updatedTruck.plate} atualizado com sucesso!`,
      });
      return updatedTruck;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar caminhão';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateTruckStatus = async (id: string, status: Truck['status']) => {
    try {
      // Primeiro, obter o caminhão atual para verificar seu status
      const currentTruck = trucks.find(truck => truck.id === id);
      
      // Se o caminhão já estiver com status "outside", não permitir atualização
      if (currentTruck?.status === 'outside') {
        toast({
          title: 'Operação não permitida',
          description: `O caminhão ${currentTruck.plate} já está fora da cidade. Use o leitor de placas para registrar uma nova entrada.`,
          variant: 'destructive'
        });
        return currentTruck;
      }
      
      const updatedTruck = await truckService.updateTruckStatus(id, status);
      await refreshTrucks();
      toast({
        title: 'Status Atualizado',
        description: `Caminhão ${updatedTruck.plate} agora está ${getStatusText(status)}`,
      });
      return updatedTruck;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteTruck = async (id: string) => {
    try {
      await truckService.deleteTruck(id);
      await refreshTrucks();
      toast({
        title: 'Sucesso',
        description: 'Caminhão removido com sucesso!',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir caminhão';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const getStatusText = (status: Truck['status']): string => {
    const statusMap: Record<Truck['status'], string> = {
      entering: 'entrando na cidade',
      in_city: 'na cidade',
      leaving: 'saindo da cidade',
      outside: 'fora da cidade'
    };
    return statusMap[status];
  };

  return (
    <TruckContext.Provider
      value={{
        trucks,
        loading,
        error,
        stats,
        refreshTrucks,
        getTruckByPlate,
        createTruck,
        updateTruck,
        updateTruckStatus,
        deleteTruck
      }}
    >
      {children}
    </TruckContext.Provider>
  );
};

export const useTrucks = () => {
  const context = useContext(TruckContext);
  if (context === undefined) {
    throw new Error('useTrucks deve ser usado dentro de um TruckProvider');
  }
  return context;
};
