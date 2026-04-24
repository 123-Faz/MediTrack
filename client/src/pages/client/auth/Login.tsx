import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import { loginUser } from "@/services/auth.service";
import { loginFormSchema } from "./schemas";
import type { LoginFormValues } from "./schemas";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface PatientLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister 
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success("Welcome back! Login Successful!");
      reset();
      navigate("/dashboard");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error || "Login failed. Please try again.");
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Gradient */}
        <div className="p-8 pb-6 text-center bg-gradient-to-br from-blue-600/10 to-indigo-600/10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Access your medical records and appointments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Email/Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("username")} 
                type="text" 
                placeholder="Enter your username or email" 
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.username ? 'border-red-400' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none`} 
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("password")} 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${errors.password ? 'border-red-400' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none`} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{errors.password.message}</p>}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as Patient
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-500 font-medium">
              New to MediTrack?{" "}
              <button 
                type="button" 
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4 transition-all"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};