
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

type ForgotPasswordFormProps = {
  onSwitchToLogin: () => void;
};

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const { forgotPassword, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!email) {
      setError("Email é obrigatório");
      return;
    }
    
    // Clear errors
    setError("");
    setSuccessMessage("");
    
    // Submit
    try {
      await forgotPassword(email);
      setSuccessMessage("Se o email existir em nossa base, você receberá instruções para redefinir sua senha.");
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
      <div>
        <Button 
          variant="ghost" 
          className="p-0 mb-4 flex items-center text-gray-500"
          onClick={onSwitchToLogin}
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar ao login
        </Button>
      </div>
      
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Esqueceu sua senha?</h1>
        <p className="text-gray-500 mt-1">Nós enviaremos um link para recuperação da sua senha</p>
      </div>
      
      {successMessage ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <p className="text-green-800">{successMessage}</p>
          <Button 
            className="mt-4 w-full bg-anpr-blue hover:bg-anpr-darkBlue"
            onClick={onSwitchToLogin}
          >
            Voltar ao login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full bg-anpr-blue hover:bg-anpr-darkBlue" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar instruções"}
          </Button>
        </form>
      )}
    </div>
  );
}
