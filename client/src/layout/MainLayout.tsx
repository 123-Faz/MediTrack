import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { PatientLogin } from "@/pages/client/auth/Login";
import { DoctorLogin } from "@/pages/doctor/auth/Login";
import { AdminLogin } from "@/pages/admin/auth/Login";

const MainLayout = () => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'admin') => {
    console.log("Role selected:", role);
    setSelectedRole(role);
  };

  const handleLoginClose = () => {
    setSelectedRole(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pass the role selection handler to Header */}
      <Header onRoleSelect={handleRoleSelect} />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Render the selected login component */}
      {selectedRole === 'patient' && (
        <PatientLogin 
          isOpen={true} 
          onClose={handleLoginClose}
          onSwitchToRegister={() => {
            console.log("Switch to patient register");
          }}
        />
      )}

      {selectedRole === 'doctor' && (
        <DoctorLogin 
          isOpen={true} 
          onClose={handleLoginClose}
        />
      )}

      {selectedRole === 'admin' && (
        <AdminLogin 
          isOpen={true} 
          onClose={handleLoginClose}
        />
      )}
    </div>
  );
};

export default MainLayout;