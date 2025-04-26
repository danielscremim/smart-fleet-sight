export interface Truck {
  id: string;
  plate: string;
  model: string;
  year: number;
  company: string;
  driver_name?: string;
  status: 'entering' | 'in_city' | 'leaving' | 'outside';
  last_seen?: string;
  created_at: string;
}

export type TruckInput = Omit<Truck, 'id' | 'created_at'>;