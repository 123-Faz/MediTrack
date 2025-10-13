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
  Stethoscope,
  User,
  LogOut, 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import UserSidebarNav from "./userSidebarNav";
import profileImage from "@/assets/pirate.jpg";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";
import { getAdmin } from '@/store/authAdminSlice';

type UserSidebarProps = {
  logoutHandle: () => void;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ logoutHandle }) => {
  const { isMobile } = useSidebar();
  const user = useAppSelector(getAdmin);

  return (
    <Sidebar collapsible="icon" className="min-w-[50px]">
      {/* Header */}
      <SidebarHeader className="bg-bg2 themeShift h-16">
        <SidebarMenu>
          <SidebarMenuItem>
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
                  <Link to="profile">
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard/settings">
                    <DropdownMenuItem>
                      <CreditCard />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="notifications">
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandle}>
                  <LogOut />
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
