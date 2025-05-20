
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

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
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error);
        localStorage.removeItem("user");
      }
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
      
      console.log("Tentando login com:", email);
      console.log("Usuários registrados:", registeredUsers);
      
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
        return Promise.resolve();
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
        return Promise.reject(new Error("Credenciais inválidas"));
      }
    } catch (error) {
      console.error("Erro completo no login:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login",
        variant: "destructive"
      });
      return Promise.reject(error);
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
          description: "Este email já está em uso",
          variant: "destructive"
        });
        return Promise.reject(new Error("Email já registrado"));
      }
      
      // Registrar novo usuário
      const updatedUsers = {
        ...registeredUsers,
        [email]: { name, password }
      };
      
      setRegisteredUsers(updatedUsers);
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Você já pode fazer login com suas credenciais",
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro durante o registro",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simular atraso de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o email existe
      if (!registeredUsers[email]) {
        toast({
          title: "Email não encontrado",
          description: "Não há conta registrada com este email",
          variant: "destructive"
        });
        return Promise.reject(new Error("Email não encontrado"));
      }
      
      toast({
        title: "Email enviado",
        description: "Instruções para recuperação de senha foram enviadas para o seu email.",
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação",
        variant: "destructive"
      });
      return Promise.reject(error);
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
