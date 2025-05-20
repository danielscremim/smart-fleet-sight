
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Home, 
  BarChart, 
  Camera, 
  LogOut,
  FileText 
} from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-anpr-offWhite">
      {/* Sidebar */}
      <aside className="bg-white shadow-md w-64 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b">
          <h1 className="text-xl font-semibold text-anpr-darkBlue flex items-center gap-2">
            <Truck /> SmartFleetSight
          </h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/inicio" 
                className={`flex items-center p-3 rounded-md transition-colors ${
                  location.pathname === "/inicio" 
                    ? "bg-anpr-lightGray text-anpr-darkBlue"
                    : "hover:bg-anpr-lightGray text-gray-600"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Início
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center p-3 rounded-md transition-colors ${
                  location.pathname === "/dashboard" 
                    ? "bg-anpr-lightGray text-anpr-darkBlue"
                    : "hover:bg-anpr-lightGray text-gray-600"
                }`}
              >
                <BarChart className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/plate-reader" 
                className={`flex items-center p-3 rounded-md transition-colors ${
                  location.pathname === "/plate-reader" 
                    ? "bg-anpr-lightGray text-anpr-darkBlue"
                    : "hover:bg-anpr-lightGray text-gray-600"
                }`}
              >
                <Camera className="mr-3 h-5 w-5" />
                Leitor de Placa
              </Link>
            </li>
            <li>
              <Link 
                to="/api-docs" 
                className={`flex items-center p-3 rounded-md transition-colors ${
                  location.pathname === "/api-docs" 
                    ? "bg-anpr-lightGray text-anpr-darkBlue"
                    : "hover:bg-anpr-lightGray text-gray-600"
                }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Documentação da API
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className="mb-4 px-3 py-2">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="flex flex-col w-full">
        <header className="bg-white shadow-sm p-4 flex md:hidden items-center justify-between">
          <h1 className="text-xl font-semibold text-anpr-darkBlue flex items-center gap-2">
            <Truck /> SmartFleetSight
          </h1>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center">
          <Link to="/inicio" className="flex-1 py-3 flex flex-col items-center justify-center">
            <Home className={`h-5 w-5 ${location.pathname === "/inicio" ? "text-anpr-blue" : "text-gray-500"}`} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          <Link to="/dashboard" className="flex-1 py-3 flex flex-col items-center justify-center">
            <BarChart className={`h-5 w-5 ${location.pathname === "/dashboard" ? "text-anpr-blue" : "text-gray-500"}`} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link to="/plate-reader" className="flex-1 py-3 flex flex-col items-center justify-center">
            <Camera className={`h-5 w-5 ${location.pathname === "/plate-reader" ? "text-anpr-blue" : "text-gray-500"}`} />
            <span className="text-xs mt-1">Leitor</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
