import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { UnifiedLogin } from "../components/auth/UnifiedLogin";
import { PatientRegister } from "../pages/client/auth/Register";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";

const MainLayout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"patient" | "doctor" | "admin">("patient");

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setIsForgotPasswordOpen(false);
  };

  const handleSwitchToForgotPassword = (role: "patient" | "doctor" | "admin") => {
    setAuthRole(role);
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(true);
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
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />

      {/* Patient Register Component */}
      <PatientRegister 
        isOpen={isRegisterOpen} 
        onClose={handleLoginClose}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Forgot Password Component */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={handleLoginClose}
        onBackToLogin={handleSwitchToLogin}
        role={authRole}
      />
    </div>
  );
};

export default MainLayout;