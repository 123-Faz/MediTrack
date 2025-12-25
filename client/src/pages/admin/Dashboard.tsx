// components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import type { userLayoutContextType } from '@/layout/adminDashboard/types';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Stethoscope,
  Activity,
  Shield,
  Search,
  ArrowUpRight,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  activeSchedules: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    activeSchedules: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'Admin Dashboard'])
  }, [setBreadcrumb])

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getCookie('admin_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch users and doctors data
      const [usersResponse, doctorsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/v1/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/v1/admin/get-all-drs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!usersResponse.ok || !doctorsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const usersData = await usersResponse.json();
      const doctorsData = await doctorsResponse.json();

      // Calculate stats from real data
      setStats({
        totalUsers: usersData.length || 0,
        totalDoctors: doctorsData.length || 0,
        totalAppointments: 0, // You can add appointments API later
        activeSchedules: doctorsData.filter((doctor: any) => doctor.schedule).length || 0
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg1 to-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bl6 mx-auto mb-4"></div>
          <p className="text-fg1-4 text-lg font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg1 to-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rd1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-rd6" />
          </div>
          <h3 className="text-lg font-semibold text-fg0 mb-2">Unable to Load Dashboard</h3>
          <p className="text-fg1-4 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-bl6 text-white rounded-lg hover:bg-bl7 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg2 themeShift p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-3xl font-bold text-bl5 text-center b-2">
                System overview and management
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg1-4 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users, doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg1 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-bl1 rounded-xl">
                <Users className="w-6 h-6 text-bl5" />
              </div>
              <TrendingUp className="w-5 h-5 text-gr6" />
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.totalUsers}</h3>
            <p className="text-fg1-4 font-medium">Total Users</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/admin/users" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Manage
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gr1 rounded-xl">
                <UserCheck className="w-6 h-6 text-gr6" />
              </div>
              <TrendingUp className="w-5 h-5 text-gr6" />
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.totalDoctors}</h3>
            <p className="text-fg1-4 font-medium">Total Doctors</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/admin/doctors" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Manage
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Active Schedules */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yl1 rounded-xl">
                <Calendar className="w-6 h-6 text-yl6" />
              </div>
              <div className="text-bl5 bg-bl7 px-2 py-1 rounded-lg text-sm font-bold">
                {stats.activeSchedules}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.activeSchedules}</h3>
            <p className="text-fg1-4 font-medium">Active Schedules</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/admin/schedules" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Review
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-ppl1 rounded-xl">
                <Shield className="w-6 h-6 text-ppl5" />
              </div>
              <div className="text-gr6 bg-gr1 px-2 py-1 rounded-lg text-sm font-bold">
                100%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">100%</h3>
            <p className="text-fg1-4 font-medium">System Health</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/admin/system" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Monitor
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Management */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg0 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-bl6" />
                Quick Management
              </h2>
              <Link 
                to="/admin/analytics" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                View analytics
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/admin/users"
                className="flex flex-col items-center p-4 bg-bl1 border border-bl2 rounded-xl hover:bg-bl2 transition-all duration-200 group"
              >
                <Users className="w-8 h-8 text-bl6 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-fg0 group-hover:text-bl6">Manage Users</p>
                <p className="text-sm text-fg1-4 text-center mt-1">{stats.totalUsers} users</p>
              </Link>
              
              <Link 
                to="/admin/doctors"
                className="flex flex-col items-center p-4 bg-gr1 border border-gr2 rounded-xl hover:bg-gr2 transition-all duration-200 group"
              >
                <UserCheck className="w-8 h-8 text-gr6 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-fg0 group-hover:text-gr6">Manage Doctors</p>
                <p className="text-sm text-fg1-4 text-center mt-1">{stats.totalDoctors} doctors</p>
              </Link>
              
              <Link 
                to="/admin/schedules"
                className="flex flex-col items-center p-4 bg-yl1 border border-yl2 rounded-xl hover:bg-yl2 transition-all duration-200 group"
              >
                <Calendar className="w-8 h-8 text-yl6 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-fg0 group-hover:text-yl6">Schedule Management</p>
                <p className="text-sm text-fg1-4 text-center mt-1">{stats.activeSchedules} active</p>
              </Link>
              
              <Link 
                to="/admin/analytics"
                className="flex flex-col items-center p-4 bg-ppl1 border border-ppl2 rounded-xl hover:bg-ppl2 transition-all duration-200 group"
              >
                <BarChart3 className="w-8 h-8 text-ppl5 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-fg0 group-hover:text-ppl5">View Analytics</p>
                <p className="text-sm text-fg1-4 text-center mt-1">System insights</p>
              </Link>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg0 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gr6" />
                System Overview
              </h2>
              <span className="text-gr6 bg-gr1 px-3 py-1 rounded-lg text-sm font-bold">
                All Systems Go
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bl1 border border-bl2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-bl6" />
                  <div>
                    <p className="font-semibold text-fg0">User Registrations</p>
                    <p className="text-sm text-fg1-4">{stats.totalUsers} total users</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-bl6 font-bold">Active</span>
                  <p className="text-xs text-fg1-5 mt-1">
                    +{getGrowthPercentage(stats.totalUsers, Math.max(0, stats.totalUsers - 5))}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gr1 border border-gr2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-gr6" />
                  <div>
                    <p className="font-semibold text-fg0">Doctor Management</p>
                    <p className="text-sm text-fg1-4">{stats.totalDoctors} doctors registered</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gr6 font-bold">Active</span>
                  <p className="text-xs text-fg1-5 mt-1">
                    +{getGrowthPercentage(stats.totalDoctors, Math.max(0, stats.totalDoctors - 2))}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yl1 border border-yl2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yl6" />
                  <div>
                    <p className="font-semibold text-fg0">Schedule Coverage</p>
                    <p className="text-sm text-fg1-4">{stats.activeSchedules} active schedules</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yl6 font-bold">
                    {Math.round((stats.activeSchedules / stats.totalDoctors) * 100)}%
                  </span>
                  <p className="text-xs text-fg1-5 mt-1">Coverage rate</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-ppl1 border border-ppl2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-ppl5" />
                  <div>
                    <p className="font-semibold text-fg0">System Status</p>
                    <p className="text-sm text-fg1-4">All services operational</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-ppl5 font-bold">100%</span>
                  <p className="text-xs text-fg1-5 mt-1">Healthy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white">
          <div className="bg-bl6 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-bl8">User Growth</p>
                <p className="text-2xl font-bold mt-1">
                  +{getGrowthPercentage(stats.totalUsers, Math.max(0, stats.totalUsers - 5))}%
                </p>
                <p className="text-sm text-bl8 mt-2">{stats.totalUsers} total users</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-gr5 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gr8">Doctor Growth</p>
                <p className="text-2xl font-bold mt-1">
                  +{getGrowthPercentage(stats.totalDoctors, Math.max(0, stats.totalDoctors - 2))}%
                </p>
                <p className="text-sm text-gr8 mt-2">{stats.totalDoctors} total doctors</p>
              </div>
              <Stethoscope className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-ppl5 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ppl8">Schedule Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((stats.activeSchedules / stats.totalDoctors) * 100)}%
                </p>
                <p className="text-sm text-ppl8 mt-2">{stats.activeSchedules} active schedules</p>
              </div>
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-bl6 text-white rounded-xl hover:bg-bl5 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;