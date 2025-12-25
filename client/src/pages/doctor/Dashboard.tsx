// components/DoctorDashboard.tsx
import React, { useState, useEffect } from 'react';
import type { userLayoutContextType } from '@/layout/userDashboard/types';
import { useOutletContext } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Stethoscope,
  Activity,
  Pill,
  FileText,
  Search,
  Bell,
  Menu
} from 'lucide-react';

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalPatients: number;
  pendingPrescriptions: number;
}

interface Appointment {
  _id: string;
  patientName: string;
  appointmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

const DoctorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();
  
  useEffect(() => {
      setBreadcrumb(['Dashboard', 'Doctor Dashboard'])
    }, [setBreadcrumb])
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getCookie('doctor_token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch appointments data
      const appointmentsResponse = await fetch('http://localhost:8000/api/v1/auth_doctor/all-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointmentsData = await appointmentsResponse.json();
      const allAppointments = appointmentsData.appointments || appointmentsData.data || [];
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayApps = allAppointments.filter((apt: any) => 
        apt.appointmentDate === today && (apt.status === 'approved' || apt.status === 'confirmed')
      );

      // Get unique patients
      const uniquePatients = new Set(allAppointments.map((apt: any) => apt.user?._id || apt.user));

      setStats({
        totalAppointments: allAppointments.length,
        todayAppointments: todayApps.length,
        totalPatients: uniquePatients.size,
        pendingPrescriptions: 0 // You can add prescription count logic
      });

      // Get recent appointments (last 5)
      const recent = allAppointments
        .filter((apt: any) => apt.status === 'approved' || apt.status === 'confirmed')
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setRecentAppointments(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const formatTime = (timeString: string): string => {
    try {
      if (timeString.includes('am') || timeString.includes('pm')) {
        return timeString;
      }
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'bg-gr1 text-gr8';
      case 'pending':
        return 'bg-yl1 text-yl8';
      case 'completed':
        return 'bg-bl1 text-bl8';
      default:
        return 'bg-bg1 text-bg8';
    }
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

  return (
    <div className="min-h-screen bg-bg2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-bl5 mb-2 text-center">Doctor Dashboard</h1>
          <p className="text-xl text-bg6 text-center">Welcome back!  Here's your practice overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-bg6">Total Appointments</p>
                <p className="text-3xl font-bold text-bg9 mt-2">{stats.totalAppointments}</p>
                <p className="text-sm text-gr6 mt-1">All time</p>
              </div>
              <div className="p-3 bg-bl6 rounded-xl">
                <Calendar className="w-6 h-6 text-bl4" />
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-bg6">Today's Appointments</p>
                <p className="text-3xl font-bold text-bg9 mt-2">{stats.todayAppointments}</p>
                <p className="text-sm text-or6 mt-1">Scheduled for today</p>
              </div>
              <div className="p-3 bg-or6 rounded-xl">
                <Clock className="w-6 h-6 text-or4" />
              </div>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-bg6">Total Patients</p>
                <p className="text-3xl font-bold text-bg9 mt-2">{stats.totalPatients}</p>
                <p className="text-sm text-gr6 mt-1">Unique patients</p>
              </div>
              <div className="p-3 bg-gr6 rounded-xl">
                <Users className="w-6 h-6 text-gr4" />
              </div>
            </div>
          </div>

          {/* Pending Prescriptions */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-bg6">Pending Prescriptions</p>
                <p className="text-3xl font-bold text-bg9 mt-2">{stats.pendingPrescriptions}</p>
                <p className="text-sm text-ppl6 mt-1">To be created</p>
              </div>
              <div className="p-3 bg-ppl6 rounded-xl">
                <Pill className="w-6 h-6 text-ppl4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-bg9">Recent Appointments</h2>
              <button className="text-bl5 hover:text-bl7 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-bg9 mx-auto mb-3" />
                  <p className="text-bg9">No recent appointments</p>
                </div>
              ) : (
                recentAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between p-4 border border-bg4 rounded-xl hover:bg-bg3 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-bg9">{appointment.patientName}</h3>
                        <p className="text-sm text-bg6 capitalize">{appointment.appointmentType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-bg9">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="text-sm text-bg6">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg4 p-6">
            <h2 className="text-xl font-semibold text-bg9 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/drDashboard/appointments'}
                className="p-4 border-2 border-dashed border-bg3 rounded-xl hover:bg-bl1 transition-all duration-200 group"
              >
                <Calendar className="w-8 h-8 text-bg4 group-hover:text-bl5 mx-auto mb-2" />
                <p className="text-sm font-medium text-bg7 text-center">
                  View Appointments
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/drDashboard/treatment'}
                className="p-4 border-2 border-dashed border-bg3 rounded-xl hover:bg-gr1 transition-all duration-200 group"
              >
                <Pill className="w-8 h-8 text-bg4  mx-auto mb-2" />
                <p className="text-sm font-medium text-bg7 group-hover:text-gr6 text-center">
                  Treatment Management
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = '/drDashboard/schedules'}
                className="p-4 border-2 border-dashed border-bg3 rounded-xl hover:border-orange-500 hover:bg-or1 transition-all duration-200 group"
              >
                <Clock className="w-8 h-8 text-bg4 group-hover:text-or5 mx-auto mb-2" />
                <p className="text-sm font-medium text-bg7 group-hover:text-or6 text-center">
                  Manage Schedule
                </p>
              </button>
              
              <button 
                onClick={() => window.location.href = ''}
                className="p-4 border-2 border-dashed border-bg3 rounded-xl hover:bg-ppl1 transition-all duration-200 group"
              >
                <FileText className="w-8 h-8 text-bg4 mx-auto mb-2" />
                <p className="text-sm font-medium text-bg7 text-center">
                  Generate Reports
                </p>
              </button>
            </div>

            {/* Upcoming Schedule Preview */}
            <div className="mt-2 pt-6 border-bg4">
              <h3 className="text-lg font-semibold text-bg9 mb-4">Today's Schedule</h3>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-bg9">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{stats.todayAppointments} Appointments</p>
                    <p className="text-blue-100 text-sm">Scheduled for today</p>
                  </div>
                  <Activity className="w-8 h-8 text-bg9" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;