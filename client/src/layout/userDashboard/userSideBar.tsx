import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  Shield,
  LogOut,
  User,
  Stethoscope
} from "lucide-react";
import UserSidebarNav from "./userSidebarNav";
import profileImage from "@/assets/pirate.jpg";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";
import { getUser } from "@/store/authSlice";

// Import sidebar components individually to avoid issues
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarFooter } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarRail } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

type UserSidebarProps = {
  logoutHandle: () => void;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ logoutHandle }) => {
  const { isMobile } = useSidebar();
  const user = useAppSelector(getUser);

  return (
    <Sidebar collapsible="icon" className="min-w-[50px]">
      {/* Header */}
      <SidebarHeader className="bg-bg2 themeShift h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              className="flex items-center space-x-2 flex-1 lg:flex-none justify-center lg:justify-start min-w-0 px-2 h-16"
            >
              {/* Icon */}
              <div className="relative flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-900"></div>
              </div>

              {/* Text - Single line with truncate */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  MediTrack
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Healthcare
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-bg1 themeShift">
        <UserSidebarNav />
      </SidebarContent>

      {/* Footer / Profile */}
      <SidebarFooter className="bg-bg2 themeShift">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profileImage} alt="profile" />
                    <AvatarFallback className="rounded-lg">U</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.username}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profileImage} alt="profile" />
                      <AvatarFallback className="rounded-lg">U</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/dashboard/profile">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard/settings">
                    <DropdownMenuItem>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard/notifications">
                    <DropdownMenuItem>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandle}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default UserSidebar;