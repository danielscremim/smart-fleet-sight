import { supabase } from '@/lib/supabase';
import { Truck, TruckInput } from '@/types/truck';

const TABLE_NAME = 'trucks';

export const truckService = {
  // Buscar todos os caminhões
  async getAllTrucks(): Promise<Truck[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar caminhões:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar caminhão por ID
  async getTruckById(id: string): Promise<Truck | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar caminhão com ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Buscar caminhão por placa
  async getTruckByPlate(plate: string): Promise<Truck | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .ilike('plate', plate)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignora erro de "não encontrado"
      console.error(`Erro ao buscar caminhão com placa ${plate}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Criar um novo caminhão
  async createTruck(truck: TruckInput): Promise<Truck> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([truck])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar caminhão:', error);
      throw error;
    }
    
    return data;
  },
  
  // Atualizar um caminhão existente
  async updateTruck(id: string, truck: Partial<TruckInput>): Promise<Truck> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(truck)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar caminhão com ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Atualizar o status de um caminhão
  async updateTruckStatus(id: string, status: Truck['status']): Promise<Truck> {
    return this.updateTruck(id, { 
      status, 
      last_seen: new Date().toISOString() 
    });
  },
  
  // Excluir um caminhão
  async deleteTruck(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir caminhão com ID ${id}:`, error);
      throw error;
    }
  },
  
  // Buscar estatísticas de caminhões por status
  async getTruckStats(): Promise<Record<Truck['status'], number>> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('status');
    
    if (error) {
      console.error('Erro ao buscar estatísticas de caminhões:', error);
      throw error;
    }
    
    const stats: Record<Truck['status'], number> = {
      entering: 0,
      in_city: 0,
      leaving: 0,
      outside: 0
    };
    
    data.forEach(truck => {
      stats[truck.status as Truck['status']]++;
    });
    
    return stats;
  }
};