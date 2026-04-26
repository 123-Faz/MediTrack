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
import { getDoctor, doctorLogout } from "@/store/authDoctorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface HeaderProps {
  onLoginClick: () => void;
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

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const isDarkMode = useSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from all slices
  const user = useAppSelector(getUser) as RegularUser | null;
  const admin = useAppSelector(getAdmin) as AdminUser | null;
  const doctor = useAppSelector(getDoctor) as DoctorUser | null;

  // Unified authentication check
  const isLoggedIn = !!user || !!admin || !!doctor;
  const currentUser: UserType = user || admin || doctor;
  const userRole = currentUser?.role || null;

  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
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
    if (doctor) dispatch(doctorLogout());
    setShowDropdown(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setShowDropdown(false);
    switch (userRole) {
      case 'admin': navigate("/adDashboard"); break;
      case 'doctor': navigate("/drDashboard"); break;
      case 'user': navigate("/dashboard"); break;
      default: navigate("/");
    }
  };

    const settings = () => {
    setShowDropdown(false);
      switch (userRole) {
      case 'admin': navigate("/adDashboard/settings"); break;
      case 'doctor': navigate("/drDashboard/settings"); break;
      case 'user': navigate("/dashboard/settings"); break;
      default: navigate("/");
    }
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'admin': return { color: "bg-ppl6", text: "Admin", icon: Crown, gradient: "from-ppl6 to-ppl8" };
      case 'doctor': return { color: "bg-gr6", text: "Doctor", icon: Stethoscope, gradient: "from-gr6 to-gr8" };
      case 'user': return { color: "bg-bl6", text: "Patient", icon: User, gradient: "from-bl6 to-bl8" };
      default: return { color: "bg-bg5", text: "User", icon: User, gradient: "from-bg5 to-bg7" };
    }
  };

  const getUserDisplayName = (): string => {
    if (!currentUser) return "User";
    return currentUser.name || currentUser.username || currentUser.email?.split('@')[0] || "User";
  };

  const renderAuthSection = () => {
    if (!isClient) return <div className="w-20 h-9 bg-bg2 rounded-md animate-pulse"></div>;

    if (isLoggedIn && currentUser) {
      const roleBadge = getRoleBadge();
      const BadgeIcon = roleBadge.icon;

      return (
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg1 border border-bg3 hover:shadow-md transition-all themeShift"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r ${roleBadge.gradient} text-white font-semibold text-sm shadow-sm`}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-fg0">{getUserDisplayName()}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white font-black uppercase ${roleBadge.color}`}>
                    {roleBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-14 z-50 bg-bg1 shadow-2xl border border-bg3 rounded-2xl w-64 overflow-hidden animate-in zoom-in-95 duration-200"
            >
              <div className="p-4 border-b border-bg3 bg-bg2">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r ${roleBadge.gradient} text-white font-black text-lg shadow-lg`}>
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-fg0 truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-fg1-5 truncate">{currentUser.email || ""}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button onClick={goToDashboard} className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-fg1-3 hover:bg-bg2 hover:text-fg0 transition-colors font-bold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button onClick={settings} className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-fg1-3 hover:bg-bg2 hover:text-fg0 transition-colors font-bold text-sm">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-2 border-bg3" />
                <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-rd6 hover:bg-rd1 dark:hover:bg-rd9/20 transition-colors font-bold text-sm">
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
        onClick={onLoginClick}
        className="btnStyle px-6 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-fg2-5/20 hover:shadow-xl hover:scale-105 transition-all"
      >
        <LogIn className="w-4 h-4" />
        <span className="font-bold">Login</span>
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-bg1/80 border-b border-bg3 themeShift">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-xl text-fg1-3 hover:bg-bg2 transition-colors">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-bg1 w-72 border-bg3">
                  <div className="mt-8 space-y-2">
                    {navLinks.map(({ name, to, icon: Icon }) => (
                      <SheetClose asChild key={name}>
                        <Link
                          to={to}
                          className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
                            to === location.pathname
                              ? "bg-bg2 text-bl6 font-black shadow-inner"
                              : "text-fg1-3 hover:bg-bg2 hover:text-fg0"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-bold">{name}</span>
                          </Link>
                        </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <Stethoscope className="w-10 h-10 text-bl6" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gr6 rounded-full border-2 border-bg1 shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-bl6 via-ppl5 to-rd5 bg-clip-text text-transparent leading-none">
                  MediTrack
                </span>
                <span className="text-[10px] text-fg1-5 font-bold uppercase tracking-widest mt-1">
                  Healthcare Portal
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold ${
                    to === location.pathname
                      ? "bg-bg2 text-bl6 shadow-inner"
                      : "text-fg1-3 hover:bg-bg2 hover:text-fg0"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-3 rounded-full hover:bg-bg2 text-fg1-3 transition-all hover:rotate-12"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {renderAuthSection()}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;