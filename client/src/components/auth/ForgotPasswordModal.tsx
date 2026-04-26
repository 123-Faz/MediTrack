import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { forgotPassword } from "../../services/auth.service";
import React from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  role?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onBackToLogin, role = "patient" }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordValues) => {
      return forgotPassword(data.email, role);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "If an account exists, a password reset link has been sent.");
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error || "Failed to send password reset link.");
    }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    await forgotPasswordMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="max-w-md w-full bg-bg1 rounded-3xl shadow-2xl border border-bg3 overflow-hidden relative">
        <div className="p-6 pb-4 text-center bg-bl1/10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-fg1-5 hover:text-fg0">✕</button>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-bl6 text-white text-2xl shadow-lg mb-3">
            🔒
          </div>
          <h2 className="text-xl font-black text-fg0 uppercase tracking-tight">Reset Password</h2>
          <p className="text-xs text-fg1-5 mt-2 px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              {...register("email")} 
              type="email" 
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold transition-all" 
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.email.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 mt-6 rounded-xl font-black text-white shadow-lg bg-bl6 hover:bg-bl5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button" 
              onClick={onBackToLogin} 
              className="text-[11px] font-black uppercase tracking-widest text-bl6 hover:underline"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
