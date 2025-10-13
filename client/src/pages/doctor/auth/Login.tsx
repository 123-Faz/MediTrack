import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setDoctorCredentials } from "@/store/authDoctorSlice"; // Updated import
import { loginDoctor } from "@/services/auth_dr.service";
import { loginFormSchema } from "./schemas";
import type { LoginFormValues } from "./schemas";
import { Eye, EyeOff, Mail, Lock, Stethoscope, ArrowRight } from "lucide-react";
import { useState } from "react";

interface DoctorLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorLogin: React.FC<DoctorLoginProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: loginDoctor,
    onSuccess: (data) => {
      dispatch(setDoctorCredentials(data)); // Updated action name
      toast.success("Doctor Login Successful!");
      reset();
      navigate("/drDashboard");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Doctor login failed");
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutateAsync(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl">
        <div className="p-6 border-b">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Stethoscope className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Doctor Portal</span>
          </div>
          <h2 className="text-xl font-bold text-center mb-1">Doctor Login</h2>
          <p className="text-sm text-gray-600 text-center">Access your medical practice dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID or Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...register("username")} type="text" placeholder="Enter your doctor ID or email" className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? "Signing in..." : "Sign In as Doctor"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};