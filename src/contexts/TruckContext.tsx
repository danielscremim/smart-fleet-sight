
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export type TruckStatus = "entering" | "inside" | "exited";

export type TruckStatusLog = {
  status: TruckStatus;
  timestamp: Date;
  userId: string;
  userName: string;
};

export type Truck = {
  id: string;
  licensePlate: string;
  currentStatus: TruckStatus;
  entryTime: Date | null;
  exitTime: Date | null;
  statusLogs: TruckStatusLog[];
};

type TruckContextType = {
  trucks: Truck[];
  filteredTrucks: Truck[];
  addTruck: (licensePlate: string) => void;
  updateTruckStatus: (truckId: string, newStatus: TruckStatus) => void;
  currentPeriod: "day" | "week" | "month";
  setCurrentPeriod: React.Dispatch<React.SetStateAction<"day" | "week" | "month">>;
  currentStatusFilter: TruckStatus | "all";
  setCurrentStatusFilter: React.Dispatch<React.SetStateAction<TruckStatus | "all">>;
};

const TruckContext = createContext<TruckContextType>({} as TruckContextType);

export const TruckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<"day" | "week" | "month">("day");
  const [currentStatusFilter, setCurrentStatusFilter] = useState<TruckStatus | "all">("all");
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const { toast } = useToast();
  
  // Generate some sample data on first mount
  useEffect(() => {
    const sampleTrucks: Truck[] = [
      createSampleTruck("ABC1234", "entering", -30),
      createSampleTruck("DEF5678", "entering", -120),
      createSampleTruck("GHI9012", "inside", -180),
      createSampleTruck("JKL3456", "inside", -240),
      createSampleTruck("MNO7890", "exited", -300, -60),
      createSampleTruck("PQR1234", "exited", -360, -30),
    ];
    
    setTrucks(sampleTrucks);
  }, []);
  
  // Filter trucks based on period and status
  useEffect(() => {
    let filtered = [...trucks];
    
    // Filter by period
    const now = new Date();
    let cutoffDate = new Date();
    if (currentPeriod === "day") {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (currentPeriod === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    } else {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    filtered = filtered.filter(truck => {
      const lastLogDate = truck.statusLogs[truck.statusLogs.length - 1]?.timestamp || new Date(0);
      return lastLogDate >= cutoffDate;
    });
    
    // Filter by status
    if (currentStatusFilter !== "all") {
      filtered = filtered.filter(truck => truck.currentStatus === currentStatusFilter);
    }
    
    setFilteredTrucks(filtered);
  }, [trucks, currentPeriod, currentStatusFilter]);

  const addTruck = (licensePlate: string) => {
    const now = new Date();
    const newTruck: Truck = {
      id: Math.random().toString(36).slice(2),
      licensePlate: licensePlate.toUpperCase(),
      currentStatus: "entering",
      entryTime: now,
      exitTime: null,
      statusLogs: [
        {
          status: "entering",
          timestamp: now,
          userId: "1",
          userName: "Sistema ANPR"
        }
      ]
    };
    
    setTrucks(prev => [...prev, newTruck]);
    toast({
      title: "Caminhão adicionado",
      description: `Placa ${licensePlate.toUpperCase()} registrada com sucesso.`
    });
  };

  const updateTruckStatus = (truckId: string, newStatus: TruckStatus) => {
    setTrucks(prev => prev.map(truck => {
      if (truck.id === truckId) {
        const now = new Date();
        const updatedTruck = { ...truck, currentStatus: newStatus };
        
        // Update entry/exit times based on status
        if (newStatus === "inside" && !updatedTruck.entryTime) {
          updatedTruck.entryTime = now;
        } else if (newStatus === "exited") {
          updatedTruck.exitTime = now;
        }
        
        // Add to status logs
        updatedTruck.statusLogs = [
          ...truck.statusLogs,
          {
            status: newStatus,
            timestamp: now,
            userId: "1", // In a real app, get from auth context
            userName: "Operador"
          }
        ];
        
        return updatedTruck;
      }
      return truck;
    }));

    toast({
      title: "Status atualizado",
      description: `Status do caminhão alterado para ${getStatusLabel(newStatus)}`
    });
  };
  
  // Helper function to create sample trucks with relative timestamps
  const createSampleTruck = (licensePlate: string, status: TruckStatus, entryMinutesOffset: number, exitMinutesOffset?: number): Truck => {
    const now = new Date();
    const entryTime = new Date(now.getTime() + entryMinutesOffset * 60000);
    let exitTime = null;
    
    if (exitMinutesOffset !== undefined) {
      exitTime = new Date(now.getTime() + exitMinutesOffset * 60000);
    }
    
    const logs: TruckStatusLog[] = [];
    
    // Add initial "entering" log
    logs.push({
      status: "entering",
      timestamp: entryTime,
      userId: "1",
      userName: "Sistema ANPR"
    });
    
    // If status is "inside" or "exited", add "inside" log
    if (status === "inside" || status === "exited") {
      const insideTime = new Date(entryTime.getTime() + 15 * 60000); // 15 minutes after entry
      logs.push({
        status: "inside",
        timestamp: insideTime,
        userId: "1",
        userName: "Sistema ANPR"
      });
    }
    
    // If status is "exited", add "exited" log
    if (status === "exited" && exitTime) {
      logs.push({
        status: "exited",
        timestamp: exitTime,
        userId: "1",
        userName: "Sistema ANPR"
      });
    }
    
    return {
      id: Math.random().toString(36).slice(2),
      licensePlate,
      currentStatus: status,
      entryTime: entryTime,
      exitTime: status === "exited" ? exitTime : null,
      statusLogs: logs
    };
  };
  
  const getStatusLabel = (status: TruckStatus): string => {
    switch (status) {
      case "entering": return "Entrando";
      case "inside": return "Na cidade";
      case "exited": return "Saiu";
      default: return "";
    }
  };

  return (
    <TruckContext.Provider
      value={{
        trucks,
        filteredTrucks,
        addTruck,
        updateTruckStatus,
        currentPeriod,
        setCurrentPeriod,
        currentStatusFilter,
        setCurrentStatusFilter
      }}
    >
      {children}
    </TruckContext.Provider>
  );
};

export const useTrucks = () => useContext(TruckContext);
