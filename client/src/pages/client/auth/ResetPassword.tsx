import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { resetPassword } from "../../../services/auth.service";
import React from "react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const role = searchParams.get("role") || "patient";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      if (!email || !token) {
        throw new Error("Missing reset token or email. Please request a new password reset link.");
      }
      return resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role,
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password has been reset successfully!");
      // Redirect to home so they can login
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error || "Failed to reset password.");
    }
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    await resetMutation.mutateAsync(data);
  };

  if (!email || !token) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-fg0">Invalid Reset Link</h2>
          <p className="text-fg1-5">The password reset link is invalid or has expired.</p>
          <button onClick={() => navigate("/")} className="text-bl6 font-bold hover:underline">
            Go back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-bg1 rounded-3xl shadow-2xl border border-bg3 overflow-hidden">
        <div className="p-6 pb-4 text-center bg-bl1/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-bl6 text-white text-2xl shadow-lg mb-3">
            🔑
          </div>
          <h2 className="text-xl font-black text-fg0 uppercase tracking-tight">Create New Password</h2>
          <p className="text-xs text-fg1-5 mt-2 px-4">
            Please enter your new password below for <strong>{email}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">New Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold transition-all"
            />
            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input
              {...register("password_confirmation")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold transition-all"
            />
            {errors.password_confirmation && <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{errors.password_confirmation.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-6 rounded-xl font-black text-white shadow-lg bg-bl6 hover:bg-bl5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
