import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { UnifiedLogin } from "../components/auth/UnifiedLogin";
import { PatientRegister } from "../pages/client/auth/Register";

const MainLayout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen themeShift">
      {/* Pass the login trigger to Header */}
      <Header onLoginClick={handleLoginOpen} />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Unified Login Component */}
      <UnifiedLogin 
        isOpen={isLoginOpen} 
        onClose={handleLoginClose}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Patient Register Component */}
      <PatientRegister 
        isOpen={isRegisterOpen} 
        onClose={handleLoginClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default MainLayout;