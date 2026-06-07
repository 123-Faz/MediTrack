import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";
import { setDoctorCredentials } from "../../store/authDoctorSlice";
import { setAdminCredentials } from "../../store/authAdminSlice";
import { loginUser } from "../../services/auth.service";
import { loginDoctor } from "../../services/auth_dr.service";
import { loginAdmin } from "../../services/auth_admin.service";
import { useState } from "react";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type Role = 'patient' | 'doctor' | 'admin';

interface UnifiedLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: (role: Role) => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
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
      let errorMessage = "Login failed.";
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
      toast.error(errorMessage || "Login failed.");
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  const roleStyles = {
    patient: { accent: 'bg-bl6', ring: 'focus:ring-bl6', text: 'text-bl6', lightBg: 'bg-bl1/10', icon: '👤', label: 'Patient' },
    doctor: { accent: 'bg-gr6', ring: 'focus:ring-gr6', text: 'text-gr6', lightBg: 'bg-gr1/10', icon: '🩺', label: 'Doctor' },
    admin: { accent: 'bg-ppl6', ring: 'focus:ring-ppl6', text: 'text-ppl6', lightBg: 'bg-ppl1/10', icon: '🛡️', label: 'Admin' },
  };

  const style = roleStyles[role];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="max-w-md w-full bg-bg1 rounded-3xl shadow-2xl border border-bg3 overflow-hidden relative">
        <div className={`p-6 pb-4 text-center ${style.lightBg} relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-fg1-5 hover:text-fg0">✕</button>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${style.accent} text-white text-2xl shadow-lg mb-3`}>
            {style.icon}
          </div>
          <h2 className="text-xl font-black text-fg0 uppercase tracking-tight">{style.label} Login</h2>
        </div>

        <div className="flex p-1.5 bg-bg2 mx-6 mt-4 rounded-xl gap-1 border border-bg3">
          {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); reset(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                role === r ? `${roleStyles[r].accent} text-white shadow-sm` : 'text-fg1-5 hover:text-fg0'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Username/Email</label>
            <input {...register("username")} type="text" className={`w-full px-4 py-2.5 bg-bg2 border ${errors.username ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 outline-none text-sm text-fg0 font-bold ${style.ring}`} />
            {errors.username && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.username.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-fg1-4 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input {...register("password")} type={showPassword ? "text" : "password"} className={`w-full px-4 py-2.5 bg-bg2 border ${errors.password ? 'border-red-500' : 'border-bg3'} rounded-xl focus:ring-2 outline-none text-sm text-fg0 font-bold ${style.ring}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-fg1-5 text-xs">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className={`w-full py-3 mt-4 rounded-xl font-black text-white shadow-lg ${style.accent}`}>
            {isSubmitting ? "..." : "Sign In"}
          </button>

          <div className="text-center pt-2 flex flex-col items-center gap-2">
            <button type="button" onClick={() => onSwitchToForgotPassword(role)} className="text-[10px] font-black uppercase tracking-widest text-fg1-4 hover:text-fg0 hover:underline transition-colors">
              Forgot Password?
            </button>
            {role === 'patient' && (
              <button type="button" onClick={onSwitchToRegister} className={`text-[10px] font-black uppercase tracking-widest hover:underline ${style.text}`}>
                New? Create Account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
