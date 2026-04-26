import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Save,
  X,
  UserCircle,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getCurrentAdmin, updateAdminProfile } from "@/services/auth_admin.service";
import { useOutletContext } from "react-router-dom";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(10),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserData {
  _id: string;
  username: string;
  email: string;
  name: string;
  image: string;
  role: string;
  status: boolean;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URI || "http://localhost:8000";

const Profile = () => {
  const { setBreadcrumb } = useOutletContext<{ setBreadcrumb: (b: string[]) => void }>();
  useEffect(() => {
    setBreadcrumb(["Dashboard", "Profile"]);
  }, [setBreadcrumb]);

  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const data = await getCurrentAdmin();
      const adminData = data.user || data;
      setUser(adminData);
      reset({
        name: adminData.name || "",
        username: adminData.username,
        email: adminData.email,
      });
    } catch (error: any) {
      toast.error(error || "Failed to load admin profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!isEditing) setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (user) {
      reset({
        name: user.name || "",
        username: user.username,
        email: user.email,
      });
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const response = await updateAdminProfile(formData);
      setUser(response.user);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Admin profile updated successfully!");
    } catch (error: any) {
      toast.error(error || "Update failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const displayImage =
    previewUrl ||
    (user.image
      ? `${SERVER_URL}${user.image}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <img
                src={displayImage}
                alt={user.username}
                className="relative w-32 h-32 rounded-full border-2 border-border object-cover bg-bg1 shadow-2xl"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full border-4 border-background hover:bg-red-500 transition-colors shadow-lg"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-bold tracking-tight text-fg1-1">
                  {user.name || user.username}
                </h1>
                <Shield className="text-red-500" size={24} />
              </div>
              <p className="text-fg1-5 font-medium">@{user.username} · Administrator</p>
              <div className="mt-3 flex items-center gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                  System {user.role}
                </span>
                {user.status && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircle2 size={12} /> Console Access
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
            className="flex items-center gap-2 px-6 py-2.5 bg-bg1 hover:bg-bg2 border border-border rounded-xl transition-all duration-300 shadow-sm text-fg1-1"
          >
            {isEditing ? <><X size={18} /> Exit Edit</> : <><Edit3 size={18} /> Modify Profile</>}
          </button>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-bg0 border border-border rounded-2xl p-6 shadow-xl themeShift">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-500">
                <UserCircle /> Admin Authentication Details
              </h2>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    key="edit-form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-fg1-5 ml-1">Admin Display Name</label>
                        <input
                          {...register("name")}
                          className="w-full bg-bg1 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-mono text-fg1-1"
                        />
                        {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-fg1-5 ml-1">Identifier (Username)</label>
                        <input
                          {...register("username")}
                          className="w-full bg-bg1 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-mono text-fg1-1"
                        />
                        {errors.username && <p className="text-red-500 text-xs ml-1">{errors.username.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-fg1-5 ml-1">Secure Email Address</label>
                      <input
                        {...register("email")}
                        className="w-full bg-bg1 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-mono text-fg1-1"
                      />
                      {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg transition-all text-sm font-medium"
                      >
                        <Camera size={16} />
                        {selectedFile ? "Change Binary Image" : "Upload System Photo"}
                      </button>
                    </div>

                    {selectedFile && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 mt-2">
                        <CheckCircle2 className="text-red-500" size={18} />
                        <div className="flex flex-col">
                          <span className="text-xs text-fg1-3 font-semibold">Ready to patch:</span>
                          <span className="text-xs text-fg1-5 truncate max-w-[200px]">{selectedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                          className="ml-auto p-1 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSaving}
                      className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all uppercase tracking-widest"
                    >
                      {isSaving ? "Synchronizing..." : <><Save size={18} /> Update System Profile</>}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="view-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 gap-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-bg1 border border-border group hover:border-red-500/30 transition-all">
                      <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-fg1-5 uppercase tracking-wider font-semibold">Admin Name</p>
                        <p className="text-lg font-medium font-mono text-fg1-1">{user.name || "UNSET_DISPLAY_NAME"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-bg1 border border-border group hover:border-red-500/30 transition-all">
                      <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-fg1-5 uppercase tracking-wider font-semibold">System Email</p>
                        <p className="text-lg font-medium font-mono text-fg1-1">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-bg1 border border-border group hover:border-red-500/30 transition-all">
                      <div className="p-3 rounded-lg bg-red-600/10 text-red-600">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-fg1-5 uppercase tracking-wider font-semibold">Access Level</p>
                        <p className="text-lg font-medium capitalize font-mono text-fg1-1">Root {user.role}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Side Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-bg0 border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden group themeShift">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={80} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-4 text-red-500">System Logs</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-fg1-5 text-sm">Last Sync</span>
                  <span className="text-green-500 text-xs font-mono">Just Now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg1-5 text-sm">Security Clear.</span>
                  <span className="text-green-500 text-xs font-medium">Lvl 4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg1-5 text-sm">Node Status</span>
                  <span className="text-blue-400 text-xs font-mono">ACTIVE</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <button className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                  View Audit Logs &rarr;
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-500/10 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-sm text-fg1-4 leading-relaxed italic">
                  CAUTION: Admin actions are logged globally. Any changes to system profiles are recorded in the audit database.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;