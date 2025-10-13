import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// components/appointment.types.ts
export interface DoctorInfo {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phoneNumber?: string;
  experience?: number;
  consultationFee?: number;
  hospital?: string;
  rating?: number;
  bio?: string;
  education?: string[];
  availability?: string[];
  imageUrl?: string;
}

export interface Appointment {
  _id: string;
  user: string;
  doctor: DoctorInfo;
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  count: number;
  data: Appointment[];
}
// components/MyAppointments.tsx


// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchUserAppointments();
  }, []);

  const fetchUserAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getCookie('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/user/appt`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data: AppointmentsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      setAppointments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserAppointments();
  };

  const handleBookNew = () => {
    navigate('/doctors');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'cancelled':
        return '🚫';
      case 'completed':
        return '✅';
      default:
        return '⏳';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-50 text-red-700';
      case 'consultation':
        return 'bg-blue-50 text-blue-700';
      case 'follow-up':
        return 'bg-purple-50 text-purple-700';
      case 'checkup':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    approved: appointments.filter(apt => apt.status === 'approved').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    rejected: appointments.filter(apt => apt.status === 'rejected').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
              <p className="text-gray-600">Manage and track your medical appointments</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg 
                  className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={handleBookNew}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { status: 'all', label: 'Total', color: 'bg-gray-500' },
            { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
            { status: 'approved', label: 'Approved', color: 'bg-green-500' },
            { status: 'completed', label: 'Completed', color: 'bg-blue-500' },
            { status: 'rejected', label: 'Rejected', color: 'bg-red-500' },
            { status: 'cancelled', label: 'Cancelled', color: 'bg-gray-400' },
          ].map(({ status, label, color }) => (
            <div
              key={status}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md ${
                filterStatus === status ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setFilterStatus(status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts[status as keyof typeof statusCounts]}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {appointments.length === 0 ? 'No appointments yet' : 'No appointments found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {appointments.length === 0 
                ? 'Get started by booking your first appointment with our doctors.'
                : `No appointments found with status "${filterStatus}".`
              }
            </p>
            <button
              onClick={handleBookNew}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book New Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {appointment.doctor.imageUrl ? (
                          <img
                            src={appointment.doctor.imageUrl}
                            alt={appointment.doctor.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Dr. {appointment.doctor.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              <span className="mr-1">{getStatusIcon(appointment.status)}</span>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{appointment.doctor.specialization}</p>
                          {appointment.doctor.hospital && (
                            <p className="text-gray-500 text-sm">{appointment.doctor.hospital}</p>
                          )}
                          {appointment.doctor.consultationFee && (
                            <p className="text-green-600 font-semibold mt-1">
                              ₹{appointment.doctor.consultationFee} Consultation Fee
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="lg:w-80 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Patient:</span>
                        <span className="font-medium text-gray-900">{appointment.patientName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentTypeColor(appointment.appointmentType)}`}>
                          {appointment.appointmentType.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Booked:</span>
                        <span className="font-medium text-gray-900" title={formatDate(appointment.createdAt)}>
                          {getTimeAgo(appointment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms and Notes */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms / Reason</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          {appointment.symptoms}
                        </p>
                      </div>
                      {appointment.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div>
                      Appointment ID: <span className="font-mono">{appointment._id.slice(-8)}</span>
                    </div>
                    <div title={formatDate(appointment.createdAt)}>
                      Created: {formatDate(appointment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;