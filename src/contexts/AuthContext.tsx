
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Lista de usuários registrados (para simulação - seria substituído pelo banco de dados em produção)
  const [registeredUsers, setRegisteredUsers] = useState<{[email: string]: {name: string, password: string}}>(() => {
    const savedUsers = localStorage.getItem("registeredUsers");
    return savedUsers ? JSON.parse(savedUsers) : {
      "admin@smartcity.com": { name: "Admin User", password: "password" }
    };
  });

  useEffect(() => {
    // Verificar se o usuário está armazenado no localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    
    // Salvar usuários registrados no localStorage
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular atraso de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se as credenciais correspondem a algum usuário registrado
      if (registeredUsers[email] && registeredUsers[email].password === password) {
        const userData = {
          id: email,
          name: registeredUsers[email].name,
          email: email
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simular atraso de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o email já está registrado
      if (registeredUsers[email]) {
        toast({
          title: "Erro no registro",
          description: "Este email já está cadastrado",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Adicionar novo usuário à lista
      setRegisteredUsers(prev => ({
        ...prev,
        [email]: { name, password }
      }));
      
      // Para demo, fazer login automático após registro
      const userData = {
        id: email,
        name,
        email
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada.",
      });
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro durante o registro",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema.",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simular atraso de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email enviado",
        description: "Instruções para recuperação de senha foram enviadas para o seu email.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
