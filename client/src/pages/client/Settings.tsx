import React, { useEffect } from 'react';
import { Shield } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

const Settings: React.FC = () => {
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'Settings']);
  }, [setBreadcrumb]);

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-fg0 tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-bl6" />
          Security Settings
        </h1>
        <p className="text-fg1-5 mt-2">Manage your account security and authentication preferences.</p>
      </div>

      <ChangePasswordForm role="patient" accentColor="bl6" />
    </div>
  );
};

export default Settings;
