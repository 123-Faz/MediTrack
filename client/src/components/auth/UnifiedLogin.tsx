import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import { setDoctorCredentials } from "@/store/authDoctorSlice";
import { setAdminCredentials } from "@/store/authAdminSlice";
import { loginUser } from "@/services/auth.service";
import { loginDoctor } from "@/services/auth_dr.service";
import { loginAdmin } from "@/services/auth_admin.service";
import { loginFormSchema } from "@/pages/client/auth/schemas";
import type { LoginFormValues } from "@/pages/client/auth/schemas";
import { Eye, EyeOff, Mail, Lock, User, Stethoscope, Shield, ArrowRight, X } from "lucide-react";
import { useState } from "react";

type Role = 'patient' | 'doctor' | 'admin';

interface UnifiedLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToRegister 
}) => {
  const [role, setRole] = useState<Role>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      if (role === 'doctor') return loginDoctor(data);
      if (role === 'admin') return loginAdmin(data);
      return loginUser(data);
    },
    onSuccess: (data) => {
      if (role === 'doctor') {
        dispatch(setDoctorCredentials(data));
        navigate("/drDashboard");
      } else if (role === 'admin') {
        dispatch(setAdminCredentials(data));
        navigate("/adDashboard");
      } else {
        dispatch(setCredentials(data));
        navigate("/dashboard");
      }
      toast.success(`Login Successful!`);
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error || "Login failed.");
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  // Static class mapping for roles
  const roleStyles = {
    patient: { accent: 'bg-bl6', text: 'text-bl6', lightBg: 'bg-bl1/10', icon: User, label: 'Patient' },
    doctor: { accent: 'bg-gr6', text: 'text-gr6', lightBg: 'bg-gr1/10', icon: Stethoscope, label: 'Doctor' },
    admin: { accent: 'bg-ppl6', text: 'text-ppl6', lightBg: 'bg-ppl1/10', icon: Shield, label: 'Admin' },
  };

  const style = roleStyles[role];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="max-w-md w-full bg-bg1 rounded-3xl shadow-2xl border border-bg3 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Compact Header */}
        <div className={`p-6 pb-4 text-center ${style.lightBg} relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-fg1-5 hover:text-fg0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${style.accent} text-white shadow-lg mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-fg0 uppercase tracking-tight">
            {style.label} Login
          </h2>
        </div>

        {/* Role Selector (More compact) */}
        <div className="flex p-1.5 bg-bg2 mx-6 mt-4 rounded-xl gap-1 border border-bg3">
          {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); reset(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                role === r 
                  ? `${style.accent} text-white shadow-sm` 
                  : 'text-fg1-5 hover:text-fg0'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 space-y-3">
          {/* Credential */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Username/Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
              <input 
                {...register("username")} 
                type="text" 
                placeholder={`Enter ${role} ID`}
                className="w-full pl-10 pr-4 py-2.5 bg-bg2 border border-bg3 rounded-xl focus:ring-2 outline-none text-sm text-fg0 font-bold"
                style={{ '--tw-ring-color': 'var(--' + style.accent.split('-')[1] + ')' } as any}
              />
            </div>
            {errors.username && <p className="text-rd6 text-[9px] mt-1 ml-1 font-bold">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg1-5" />
              <input 
                {...register("password")} 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-10 pr-10 py-2.5 bg-bg2 border border-bg3 rounded-xl focus:ring-2 outline-none text-sm text-fg0 font-bold"
                style={{ '--tw-ring-color': 'var(--' + style.accent.split('-')[1] + ')' } as any}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg1-5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`w-full py-3 rounded-xl font-black text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${style.accent}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* Signup */}
          {role === 'patient' && (
            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={onSwitchToRegister}
                className={`text-[10px] font-black uppercase tracking-widest hover:underline ${style.text}`}
              >
                New patient? Create Account
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
