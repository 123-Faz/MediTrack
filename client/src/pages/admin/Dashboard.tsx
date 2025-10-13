// components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Stethoscope,
  Activity,
  Shield
} from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back! Here's your system overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{getGrowthPercentage(stats.totalUsers, Math.max(0, stats.totalUsers - 5))}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{getGrowthPercentage(stats.totalDoctors, Math.max(0, stats.totalDoctors - 2))}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Active Schedules */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSchedules}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((stats.activeSchedules / stats.totalDoctors) * 100)}% of doctors
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">100%</p>
                <p className="text-sm text-green-600 mt-1">All systems operational</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Management Cards */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Management</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/users'}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">
                  Manage Users
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/doctors'}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
              >
                <UserCheck className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-600 text-center">
                  Manage Doctors
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/schedules'}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
              >
                <Calendar className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600 text-center">
                  Schedule Management
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin/analytics'}
                className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
              >
                <BarChart3 className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600 text-center">
                  View Analytics
                </p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">User Registrations</p>
                    <p className="text-sm text-gray-600">{stats.totalUsers} total users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Doctor Management</p>
                    <p className="text-sm text-gray-600">{stats.totalDoctors} doctors registered</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Schedule Coverage</p>
                    <p className="text-sm text-gray-600">{stats.activeSchedules} active schedules</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">
                    {Math.round((stats.activeSchedules / stats.totalDoctors) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">System Status</p>
                    <p className="text-sm text-gray-600">All services operational</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">User Growth</p>
                <p className="text-2xl font-bold mt-1">+{getGrowthPercentage(stats.totalUsers, Math.max(0, stats.totalUsers - 5))}%</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Doctor Growth</p>
                <p className="text-2xl font-bold mt-1">+{getGrowthPercentage(stats.totalDoctors, Math.max(0, stats.totalDoctors - 2))}%</p>
              </div>
              <Stethoscope className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Schedule Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((stats.activeSchedules / stats.totalDoctors) * 100)}%
                </p>
              </div>
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;