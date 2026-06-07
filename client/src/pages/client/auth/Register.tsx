import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";
import { registerUser } from "../../../services/auth.service";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus, X } from "lucide-react";
import { useState } from "react";

// Local schema for safety
const registerFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface PatientRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const PatientRegister: React.FC<PatientRegisterProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: "", email: "", password: "", password_confirmation: "" },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created! Please login.");
      reset();
      onSwitchToLogin();
    },
    onError: (error: any) => {
      let errorMessage = "Registration failed.";
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if (error.response?.data?.error) {
          const backendError = error.response.data.error;
          errorMessage = typeof backendError === 'string' ? backendError : Object.values(backendError)[0] as string;
        } else if (error.message && Object.keys(error).length === 0) {
          errorMessage = error.message;
        } else {
          const firstVal = Object.values(error)[0];
          if (typeof firstVal === 'string') errorMessage = firstVal;
        }
      }
      toast.error(errorMessage || "Registration failed.");
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await registerMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="max-w-md w-full bg-bg1 rounded-3xl shadow-2xl border border-bg3 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-6 pb-4 text-center bg-bl1/10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-fg1-5 hover:text-fg0">
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-bl6 text-white shadow-lg mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-fg0 uppercase tracking-tight">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 space-y-3">
          <div className="space-y-3 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
                <input {...register("username")} type="text" placeholder="Choose username" className={`w-full pl-10 pr-4 py-2 bg-bg2 border ${errors.username ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold`} />
              </div>
              {errors.username && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
                <input {...register("email")} type="email" placeholder="your@email.com" className={`w-full pl-10 pr-4 py-2 bg-bg2 border ${errors.email ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold`} />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full pl-10 pr-10 py-2 bg-bg2 border ${errors.password ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold`} />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
                <input {...register("password_confirmation")} type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={`w-full pl-10 pr-10 py-2 bg-bg2 border ${errors.password_confirmation ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 focus:ring-bl6 outline-none text-sm text-fg0 font-bold`} />
              </div>
              {errors.password_confirmation && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password_confirmation.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-bl6 hover:bg-bl7 text-white py-3 rounded-xl font-black shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Register <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          <div className="text-center pt-2">
            <button type="button" onClick={onSwitchToLogin} className="text-[10px] font-black uppercase tracking-widest text-bl6 hover:underline">
              Have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
