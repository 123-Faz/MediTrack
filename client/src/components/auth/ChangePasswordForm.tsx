import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";
import { changePassword } from "../../services/auth.service";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  role: 'patient' | 'doctor' | 'admin';
  accentColor?: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ role, accentColor = "bl6" }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordValues) => {
      return changePassword({ ...data, role });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully!");
      reset();
    },
    onError: (error: any) => {
      toast.error(error || "Failed to change password.");
    }
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    await changePasswordMutation.mutateAsync(data);
  };

  const accentClass = `bg-${accentColor}`;
  const ringClass = `focus:ring-${accentColor}`;
  const borderClass = `border-${accentColor}`;
  const textClass = `text-${accentColor}`;

  return (
    <div className="bg-bg1 rounded-3xl shadow-xl border border-bg3 overflow-hidden">
      {/* Header Section */}
      <div className={`p-6 sm:p-8 border-b border-bg3 bg-bg2 flex items-start gap-4`}>
        <div className={`p-3 ${accentClass} rounded-2xl shadow-lg shrink-0`}>
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-fg0">Change Password</h2>
          <p className="text-sm text-fg1-5 mt-1">
            It's a good idea to use a strong password that you're not using elsewhere.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inputs Column */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-fg1-4 uppercase tracking-widest ml-1">Current Password</label>
              <input 
                {...register("oldPassword")} 
                type="password" 
                placeholder="Enter current password"
                className={`w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 ${ringClass} outline-none text-sm text-fg0 font-bold transition-all`} 
              />
              {errors.oldPassword && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.oldPassword.message}</p>}
            </div>

            <div className="space-y-2 pt-2 border-t border-bg3">
              <label className="text-[11px] font-black text-fg1-4 uppercase tracking-widest ml-1">New Password</label>
              <input 
                {...register("newPassword")} 
                type="password" 
                placeholder="Enter new password"
                className={`w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 ${ringClass} outline-none text-sm text-fg0 font-bold transition-all`} 
              />
              {errors.newPassword && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-fg1-4 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input 
                {...register("confirmPassword")} 
                type="password" 
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 ${ringClass} outline-none text-sm text-fg0 font-bold transition-all`} 
              />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Information Column */}
          <div className="bg-bg2 p-6 rounded-2xl border border-bg3 hidden md:flex flex-col justify-center">
            <h3 className="font-bold text-fg0 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-gr6" />
              Password Requirements
            </h3>
            <ul className="space-y-3 text-sm text-fg1-5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gr5 shrink-0 mt-0.5" />
                <span>Minimum 6 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gr5 shrink-0 mt-0.5" />
                <span>Use a mix of letters, numbers, and symbols</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gr5 shrink-0 mt-0.5" />
                <span>Avoid using personal information</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-bg3 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`px-8 py-3 rounded-xl font-black text-white shadow-lg ${accentClass} hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
