import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Check, FileText, Truck, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function PlateRegistration() {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Aqui você manteria sua lógica de registro existente
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Placa registrada com sucesso!",
        description: `A placa ${plateNumber} foi adicionada ao sistema.`,
        variant: "default",
      });
      
      // Reset form
      setPlateNumber('');
      setVehicleType('');
      setDescription('');
      setImage(null);
      setPreviewUrl('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Registro de Placas</h1>
          <p className="text-gray-400 mt-2">Adicione novos veículos ao sistema de monitoramento</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber" className="text-white">Número da Placa</Label>
                  <Input
                    id="plateNumber"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="ABC1234"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-[#1F75FE] focus:ring-[#1F75FE]/20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-white">Tipo de Veículo</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType} required>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white focus:border-[#1F75FE] focus:ring-[#1F75FE]/20">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="car">Carro</SelectItem>
                      <SelectItem value="truck">Caminhão</SelectItem>
                      <SelectItem value="motorcycle">Motocicleta</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="bus">Ônibus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Informações adicionais sobre o veículo..."
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-[#1F75FE] focus:ring-[#1F75FE]/20 min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white">Imagem do Veículo</Label>
                  <div className="flex items-center gap-4">
                    <label 
                      htmlFor="image" 
                      className="flex items-center justify-center w-full h-12 px-4 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-[#1F75FE] transition-colors bg-slate-900/50"
                    >
                      <Upload className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">Escolher arquivo</span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-slate-600 text-white hover:bg-slate-700 hover:text-white"
                      onClick={() => document.getElementById('camera').click()}
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        id="camera"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#1F75FE] hover:bg-blue-600 text-white py-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Registrar Placa
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="bg-slate-900/80 p-6 md:p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4">Pré-visualização</h3>
              
              {previewUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-[300px] object-contain rounded-lg border border-slate-700"
                  />
                  <div className="mt-4 bg-slate-800/80 p-3 rounded-lg w-full">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-[#1F75FE]" />
                      <span className="text-white font-medium">{plateNumber || 'ABC1234'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-[#1F75FE]" />
                      <span className="text-gray-400">
                        {vehicleType ? 
                          vehicleType === 'car' ? 'Carro' : 
                          vehicleType === 'truck' ? 'Caminhão' : 
                          vehicleType === 'motorcycle' ? 'Motocicleta' : 
                          vehicleType === 'van' ? 'Van' : 'Ônibus'
                          : 'Tipo de veículo'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg p-8">
                  <Camera className="h-16 w-16 text-slate-700 mb-4" />
                  <p className="text-slate-500 text-center">
                    A imagem do veículo aparecerá aqui após o upload
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}