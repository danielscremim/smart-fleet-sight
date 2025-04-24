
import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Truck } from "lucide-react";

type AuthView = "login" | "register" | "forgotPassword";

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("login");
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - Image */}
      <div className="hidden md:flex md:w-1/2 bg-anpr-blue">
        <div className="p-12 flex flex-col justify-between w-full bg-gradient-to-br from-anpr-darkBlue to-anpr-blue">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">SmartFleetSight</h1>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Gestão inteligente de caminhões para sua cidade
            </h2>
            <p className="text-white/80">
              Monitore o fluxo de caminhões com reconhecimento automático de placas, 
              tenha acesso a dados em tempo real e aumente a eficiência da sua operação.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white text-2xl font-bold">60%</div>
                <div className="text-white/80 text-sm">Redução de custos operacionais</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white text-2xl font-bold">95%</div>
                <div className="text-white/80 text-sm">Precisão na leitura de placas</div>
              </div>
            </div>
          </div>
          
          <div className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} SmartFleetSight. Todos os direitos reservados.
          </div>
        </div>
      </div>
      
      {/* Right column - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-anpr-offWhite">
        {view === "login" && (
          <LoginForm 
            onSwitchToRegister={() => setView("register")} 
            onSwitchToForgotPassword={() => setView("forgotPassword")} 
          />
        )}
        {view === "register" && (
          <RegisterForm onSwitchToLogin={() => setView("login")} />
        )}
        {view === "forgotPassword" && (
          <ForgotPasswordForm onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
