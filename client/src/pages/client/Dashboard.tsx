import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { useOutletContext } from "react-router-dom";
import { 
  Calendar, 
  Stethoscope, 
  FileText, 
  Clock, 
  TrendingUp, 
  User,
  ArrowUpRight,
  Search,
  CalendarDays,
  Pill
} from 'lucide-react';

// Types
interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  activePrescriptions: number;
  upcomingAppointments: number;
}

interface RecentAppointment {
  _id: string;
  doctor: {
    username: string;
    specialization: string;
  };
  appointmentType: string;
  status: string;
  createdAt: string;
}

interface RecentPrescription {
  _id: string;
  doctor_id: {
    name: string;
  };
  medications: Array<{
    name: string;
  }>;
  issue_date: string;
  status: string;
}

// Utility function
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'User Dashboard'])
  }, [setBreadcrumb])
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    activePrescriptions: 0,
    upcomingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<RecentPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getCookie('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch appointments
      const appointmentsResponse = await fetch('http://localhost:8000/api/v1/user/appt', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const appointmentsData = await appointmentsResponse.json();
      const appointments = appointmentsData.data || [];

      // Fetch prescriptions
      const prescriptionsResponse = await fetch('http://localhost:8000/api/v1/user/psp', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const prescriptionsData = await prescriptionsResponse.json();
      const prescriptions = prescriptionsData.data || [];

      // Calculate stats
      const totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter((apt: any) => apt.status === 'pending').length;
      const activePrescriptions = prescriptions.filter((script: any) => script.status === 'active').length;
      const upcomingAppointments = appointments.filter((apt: any) => 
        ['pending', 'approved'].includes(apt.status)
      ).length;

      setStats({
        totalAppointments,
        pendingAppointments,
        activePrescriptions,
        upcomingAppointments
      });

      // Set recent data (last 3 items)
      setRecentAppointments(appointments.slice(0, 3));
      setRecentPrescriptions(prescriptions.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'text-gr6 bg-gr1 border-gr2';
      case 'pending':
        return 'text-yl6 bg-yl1 border-yl2';
      case 'rejected':
      case 'expired':
        return 'text-rd6 bg-rd1 border-rd2';
      case 'completed':
        return 'text-bl6 bg-bl1 border-bl2';
      default:
        return 'text-bg6 bg-bg1 border-bg2';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'completed':
        return '✅';
      case 'expired':
        return '⏰';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg1 to-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bl6 mx-auto mb-4"></div>
          <p className="text-fg1-4 text-lg font-semibold">Loading your healthcare dashboard...</p>
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
            {/* Search Bar */}
            <div className="relative lg:w-80 ml-77">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg1-4 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments, prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg1 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-bl1 rounded-xl">
                <Calendar className="w-6 h-6 text-bl5" />
              </div>
              <TrendingUp className="w-5 h-5 text-gr6" />
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.totalAppointments}</h3>
            <p className="text-fg1-4 font-medium">Total Appointments</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/dashboard/appointments" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yl1 rounded-xl">
                <Clock className="w-6 h-6 text-yl6" />
              </div>
              <div className="text-rd6 bg-rd1 px-2 py-1 rounded-lg text-sm font-bold">
                {stats.pendingAppointments}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.pendingAppointments}</h3>
            <p className="text-fg1-4 font-medium">Pending Approval</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/dashboard/appointments?filter=pending" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Review
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Active Prescriptions */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gr1 rounded-xl">
                <Pill className="w-6 h-6 text-gr6" />
              </div>
              <TrendingUp className="w-5 h-5 text-gr6" />
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.activePrescriptions}</h3>
            <p className="text-fg1-4 font-medium">Active Prescriptions</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/dashboard/myprescriptions" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Manage
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <CalendarDays className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-bl5 bg-bl7 px-2 py-1 rounded-lg text-sm font-bold">
                {stats.upcomingAppointments}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{stats.upcomingAppointments}</h3>
            <p className="text-fg1-4 font-medium">Upcoming Visits</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <Link 
                to="/dashboard/appointments?filter=upcoming" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                Schedule
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg0 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-bl6" />
                Recent Appointments
              </h2>
              <Link 
                to="/dashboard/appointments" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-bg4 mx-auto mb-3" />
                <p className="text-fg1-4 font-medium">No appointments yet</p>
                <p className="text-fg1-5 text-sm mb-4">Schedule your first consultation</p>
                <Link
                  to="/dashboard/doctors"
                  className="inline-flex items-center px-4 py-2 bg-bl6 text-white rounded-lg hover:bg-bl7 transition-colors text-sm font-medium"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Find Doctors
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div 
                    key={appointment._id}
                    className="flex items-center justify-between p-4 bg-bg2 rounded-xl border border-bg3 hover:border-bl4 transition-colors group cursor-pointer"
                    onClick={() => navigate('/dashboard/appointments')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-bl4 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-bl6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fg0 group-hover:text-bl3 transition-colors">
                          Dr. {appointment.doctor.username}
                        </h4>
                        <p className="text-sm text-fg1-4">{appointment.doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        <span className="mr-1">{getStatusIcon(appointment.status)}</span>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <p className="text-xs text-fg1-5 mt-1" title={formatDate(appointment.createdAt)}>
                        {getTimeAgo(appointment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg0 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gr6" />
                Recent Prescriptions
              </h2>
              <Link 
                to="/dashboard/myprescriptions" 
                className="text-bl6 hover:text-bl7 font-medium text-sm flex items-center group"
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {recentPrescriptions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-bg4 mx-auto mb-3" />
                <p className="text-fg1-4 font-medium">No prescriptions yet</p>
                <p className="text-fg1-5 text-sm">Your prescriptions will appear here after consultations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div 
                    key={prescription._id}
                    className="flex items-center justify-between p-4 bg-bg2 rounded-xl border border-bg3 hover:border-gr4 transition-colors group cursor-pointer"
                    onClick={() => navigate('/dashboard/myprescriptions')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gr1 rounded-lg flex items-center justify-center">
                        <Pill className="w-5 h-5 text-gr6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fg0 group-hover:text-gr6 transition-colors">
                          {prescription.medications[0]?.name || 'Prescription'}
                        </h4>
                        <p className="text-sm text-fg1-4">
                          Dr. {prescription.doctor_id?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        <span className="mr-1">{getStatusIcon(prescription.status)}</span>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                      <p className="text-xs text-fg1-5 mt-1" title={formatDate(prescription.issue_date)}>
                        {getTimeAgo(prescription.issue_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
          <h2 className="text-xl font-bold text-fg0 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/doctors"
              className="flex items-center p-4 bg-bl6 border border-bl3 rounded-xl hover:from-bl2 hover:to-bl3 transition-all duration-200 group"
            >
              <Stethoscope className="w-8 h-8 text-bl4 mr-3" />
              <div>
                <h3 className="font-semibold text-fg0 group-hover:text-bl4">Find Doctors</h3>
                <p className="text-sm text-fg1-4">Book new consultation</p>
              </div>
            </Link>

            <Link
              to="/dashboard/appointments"
              className="flex items-center p-4 bg-gr6 border border-gr3 rounded-xl hover:from-gr2 hover:to-gr3 transition-all duration-200 group"
            >
              <Calendar className="w-8 h-8 text-gr4 mr-3" />
              <div>
                <h3 className="font-semibold text-fg0 group-hover:text-gr4">My Appointments</h3>
                <p className="text-sm text-fg1-4">View all bookings</p>
              </div>
            </Link>

            <Link
              to="/dashboard/myprescriptions"
              className="flex items-center p-4 bg-ppl7 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
            >
              <FileText className="w-8 h-8 text-ppl4 mr-3" />
              <div>
                <h3 className="font-semibold text-fg0 group-hover:text-ppl4">Prescriptions</h3>
                <p className="text-sm text-fg1-4">Manage medications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;