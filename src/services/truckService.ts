import { supabase } from "@/integrations/supabase/client";
import { Truck } from "@/types/truck";

// Funções individuais
const getAllTrucks = async () => {
  try {
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .order('last_seen', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar caminhões:", error);
    return [];
  }
};

// Obter caminhão por ID
const getTruckById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar caminhão:", error);
    return null;
  }
};

// Obter caminhão por placa
const getTruckByPlate = async (plate: string) => {
  try {
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .eq('plate', plate)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar caminhão por placa:", error);
    return null;
  }
};

// Atualizar status do caminhão
const updateTruckStatus = async (id: string, status: Truck['status']) => {
  try {
    const now = new Date().toISOString();
    
    // Atualizamos o caminhão com o novo status e timestamp
    // sem tentar acessar ou atualizar status_timestamps
    const { data, error } = await supabase
      .from('trucks')
      .update({ 
        status, 
        last_seen: now
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error("Erro ao atualizar status do caminhão:", error);
    throw error;
  }
};

// Criar um novo caminhão
const createTruck = async (truck: Omit<Truck, 'id'>) => {
  try {
    // Não incluímos o campo status_timestamps
    const { data, error } = await supabase
      .from('trucks')
      .insert([truck])
      .select();
      
    if (error) {
      console.error("Erro ao criar caminhão:", error);
      throw error;
    }
    
    return data?.[0];
  } catch (error) {
    console.error("Erro ao criar caminhão:", error);
    throw error;
  }
};

// Função para obter estatísticas de caminhões
const getTruckStats = async () => {
  try {
    const { data, error } = await supabase
      .from('trucks')
      .select('status');
      
    if (error) throw error;
    
    // Inicializar contadores
    const stats = {
      entering: 0,
      in_city: 0,
      leaving: 0,
      outside: 0
    };
    
    // Contar caminhões por status
    data?.forEach(truck => {
      if (truck.status in stats) {
        stats[truck.status as keyof typeof stats]++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return {
      entering: 0,
      in_city: 0,
      leaving: 0,
      outside: 0
    };
  }
};

// Atualizar caminhão
const updateTruck = async (id: string, truck: Partial<Truck>) => {
  try {
    const { data, error } = await supabase
      .from('trucks')
      .update(truck)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error("Erro ao atualizar caminhão:", error);
    throw error;
  }
};

// Excluir caminhão
const deleteTruck = async (id: string) => {
  try {
    const { error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao excluir caminhão:", error);
    throw error;
  }
};

// Exportar todas as funções como um objeto único
export const truckService = {
  getAllTrucks,
  getTruckById,
  getTruckByPlate,
  updateTruckStatus,
  createTruck,
  getTruckStats,
  updateTruck,
  deleteTruck
};