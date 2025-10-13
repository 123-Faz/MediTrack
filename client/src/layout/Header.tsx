import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  Menu, 
  Sun, 
  Moon, 
  LogIn,
  User,
  Settings,
  LogOut,
  Crown,
  Shield,
  X
} from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import { toggleDarkMode, selectDarkMode } from "@/store/darkModeSlice";
import { getUser, logout } from "@/store/authSlice";
import { getAdmin, adminLogout } from "@/store/authAdminSlice";
import { getDoctor, doctorLogout } from "@/store/authDoctorSlice"; // Add doctor imports
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface HeaderProps {
  onRoleSelect: (role: 'patient' | 'doctor' | 'admin') => void;
}

// Define user type interfaces
interface BaseUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
}

interface RegularUser extends BaseUser {
  role: 'user';
}

interface AdminUser extends BaseUser {
  role: 'admin';
}

interface DoctorUser extends BaseUser {
  role: 'doctor';
}

type UserType = RegularUser | AdminUser | DoctorUser | null;

const Header: React.FC<HeaderProps> = ({ onRoleSelect }) => {
  const isDarkMode = useSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from all slices
  const user = useAppSelector(getUser) as RegularUser | null;
  const admin = useAppSelector(getAdmin) as AdminUser | null;
  const doctor = useAppSelector(getDoctor) as DoctorUser | null; // Add doctor selector

  // Unified authentication check - include doctor
  const isLoggedIn = !!user || !!admin || !!doctor;
  const currentUser: UserType = user || admin || doctor; // Include doctor in priority
  const userRole = currentUser?.role || null;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const [isClient, setIsClient] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const roleModalRef = useRef<HTMLDivElement | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)) ||
        (roleModalRef.current && !roleModalRef.current.contains(e.target as Node))
      ) {
        setShowDropdown(false);
        setShowRoleModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { name: "Home", to: "/", icon: Home },
    { name: "Doctors", to: "/doctors", icon: Stethoscope },
    { name: "Appointments", to: "/apointments", icon: Calendar },
    { name: "About", to: "/about", icon: Users },
    { name: "Contact", to: "/contact", icon: FileText },
  ];

  const handleLogout = () => {
    if (user) dispatch(logout());
    if (admin) dispatch(adminLogout());
    if (doctor) dispatch(doctorLogout()); // Add doctor logout
    setShowDropdown(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setShowDropdown(false);
    switch (userRole) {
      case 'admin':
        navigate("/adDashboard");
        break;
      case 'doctor':
        navigate("/drDashboard");
        break;
      case 'user':
        navigate("/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'admin') => {
    onRoleSelect(role); // Call the prop function
    setShowRoleModal(false);
  };

  const handleCloseLogin = () => {
    setSelectedRole(null);
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'admin':
        return { 
          color: "bg-red-500", 
          text: "Admin", 
          icon: Crown,
          gradient: "from-red-600 to-orange-600"
        };
      case 'doctor':
        return { 
          color: "bg-green-500", 
          text: "Doctor", 
          icon: Stethoscope,
          gradient: "from-green-600 to-teal-600"
        };
      case 'user':
        return { 
          color: "bg-blue-500", 
          text: "User", 
          icon: User,
          gradient: "from-blue-600 to-purple-600"
        };
      default:
        return { 
          color: "bg-gray-500", 
          text: "User", 
          icon: User,
          gradient: "from-gray-600 to-gray-700"
        };
    }
  };

  const getUserDisplayName = (): string => {
    if (!currentUser) return "User";
    return currentUser.name || currentUser.username || currentUser.email?.split('@')[0] || "User";
  };

  const getUserInitial = (): string => {
    return getUserDisplayName().charAt(0).toUpperCase();
  };

  const getDashboardName = (): string => {
    switch (userRole) {
      case 'admin':
        return "Admin Dashboard";
      case 'doctor':
        return "Doctor Dashboard";
      case 'user':
        return "User Dashboard";
      default:
        return "Dashboard";
    }
  };

  const renderAuthSection = () => {
    if (!isClient) {
      return <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>;
    }

    if (isLoggedIn && currentUser) {
      const roleBadge = getRoleBadge();
      const BadgeIcon = roleBadge.icon;

      return (
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r ${roleBadge.gradient} text-white font-semibold text-sm`}>
                {getUserInitial()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getUserDisplayName()}
                </p>
                <div className="flex items-center gap-1">
                  <BadgeIcon className="w-3 h-3 text-white" />
                  <span className={`text-xs px-1.5 py-0.5 rounded-full text-white ${roleBadge.color}`}>
                    {roleBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 z-50 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl w-64 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r ${roleBadge.gradient} text-white font-semibold text-lg`}>
                    {getUserInitial()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {currentUser.email || ""}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <BadgeIcon className="w-3 h-3" />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        userRole === 'admin' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                          : userRole === 'doctor'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      } capitalize`}>
                        {userRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={goToDashboard}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>{getDashboardName()}</span>
                </button>
                
                <button className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowRoleModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        <LogIn className="w-4 h-4" />
        <span className="font-medium">Login</span>
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white dark:bg-gray-900 w-64">
                  <div className="mt-8 space-y-4">
                    {navLinks.map(({ name, to, icon: Icon }) => (
                      <SheetClose asChild key={name}>
                        <Link
                          to={to}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            to === location.pathname
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{name}</span>
                          </Link>
                        </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 flex-1 lg:flex-none justify-center lg:justify-start min-w-0"
            >
              <div className="relative">
                <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MediTrack
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Healthcare Management
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    to === location.pathname
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {renderAuthSection()}
              
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            ref={roleModalRef}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Login Type</h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Choose your role to continue
              </p>
            </div>

            <div className="p-6 space-y-3">
              {/* Patient Option */}
              <button
                onClick={() => handleRoleSelect('patient')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Patient</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access medical records and appointments</p>
                </div>
              </button>

              {/* Doctor Option */}
              <button
                onClick={() => handleRoleSelect('doctor')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Doctor</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage appointments and prescriptions</p>
                </div>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Administrator</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage system and user accounts</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Spacer */}
      <div className="h-16"></div>

      {/* Import and render the selected login component */}
      {selectedRole === 'patient' && (
        // You'll need to import and use your PatientLogin component here
        <div>Patient Login Component</div>
      )}
      {selectedRole === 'doctor' && (
        // You'll need to import and use your DoctorLogin component here
        <div>Doctor Login Component</div>
      )}
      {selectedRole === 'admin' && (
        // You'll need to import and use your AdminLogin component here
        <div>Admin Login Component</div>
      )}
    </>
  );
};

export default Header;