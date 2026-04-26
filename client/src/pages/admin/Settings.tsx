import React, { useEffect } from 'react';
import { Shield } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { userLayoutContextType } from "@/layout/adminDashboard/types";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

const AdminSettings: React.FC = () => {
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Admin', 'Settings']);
  }, [setBreadcrumb]);

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-fg0 tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-ppl6" />
          Security Settings
        </h1>
        <p className="text-fg1-5 mt-2">Manage your administrative account security.</p>
      </div>

      <ChangePasswordForm role="admin" accentColor="ppl6" />
    </div>
  );
};

export default AdminSettings;
