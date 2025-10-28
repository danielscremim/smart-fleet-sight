import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PlateDetection {
  plate: string;
  confidence: number;
  timestamp: Date;
}

interface PlateDetectionListProps {
  detections: PlateDetection[];
  onClear: () => void;
  onSelectPlate?: (plate: string) => void;
}

export const PlateDetectionList: React.FC<PlateDetectionListProps> = ({
  detections,
  onClear,
  onSelectPlate
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Alta';
    if (confidence >= 0.8) return 'Média';
    return 'Baixa';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Placas Detectadas ({detections.length})
        </CardTitle>
        {detections.length > 0 && (
          <Button
            onClick={onClear}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {detections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma placa detectada ainda</p>
            <p className="text-sm">Inicie a captura automática para começar</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {detections.map((detection, index) => (
              <div
                key={`${detection.plate}-${detection.timestamp.getTime()}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-blue-600">
                      {detection.plate}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {format(detection.timestamp, 'HH:mm:ss', { locale: ptBR })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${getConfidenceColor(detection.confidence)} text-white`}
                  >
                    {getConfidenceText(detection.confidence)} ({(detection.confidence * 100).toFixed(1)}%)
                  </Badge>
                  
                  {onSelectPlate && (
                    <Button
                      onClick={() => onSelectPlate(detection.plate)}
                      variant="outline"
                      size="sm"
                    >
                      Usar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};