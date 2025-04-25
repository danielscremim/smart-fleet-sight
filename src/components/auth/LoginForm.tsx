
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
};

export function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate(); // Adicionar esta linha
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: {email?: string; password?: string} = {};
    if (!email) newErrors.email = "Email é obrigatório";
    if (!password) newErrors.password = "Senha é obrigatória";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Submit
    try {
      await login(email, password);
      navigate('/'); // Adicionar esta linha para redirecionar após login bem-sucedido
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <div className="bg-anpr-lightGray p-3 rounded-full">
            <Truck size={32} className="text-anpr-blue" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold mt-4 text-gray-900">Bem-vindo de volta</h1>
        <p className="text-gray-500 mt-1">Entre com sua conta para continuar</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs font-normal text-anpr-blue"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToForgotPassword();
              }}
            >
              Esqueceu a senha?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        
        <Button type="submit" className="w-full bg-anpr-blue hover:bg-anpr-darkBlue" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">Não tem uma conta? </span>
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm font-normal text-anpr-blue"
          onClick={onSwitchToRegister}
        >
          Registre-se
        </Button>
      </div>
    </div>
  );
}
