import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { useOutletContext } from "react-router-dom";
// components/appointment.types.ts
export interface DoctorInfo {
  _id: string;
  username: string;
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
  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'My Appointments'])
  }, [setBreadcrumb])
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
        return 'bg-gr1 text-gr8 border-gr2';
      case 'rejected':
        return 'bg-rd1 text-rd8 border-rd2';
      case 'cancelled':
        return 'bg-bg1 text-bg8 border-bg2';
      case 'completed':
        return 'bg-bl1 text-bl8 border-bl2';
      default:
        return 'bg-yl1 text-yl8 border-yl2';
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
        return 'bg-rd1 text-rd7';
      case 'consultation':
        return 'bg-bl1 text-bl7';
      case 'follow-up':
        return 'bg-purple-50 text-purple-700';
      case 'checkup':
        return 'bg-gr1 text-gr7';
      default:
        return 'bg-bg1 text-bg7';
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
      <div className="min-h-screen text-forground bg-bg1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bl6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg2 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-bl5 text-2xl font-bold mb-2 text-center">Manage and track your medical appointments</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 border border-bg3 rounded-lg text-bg7 bg-bg2 hover:bg-bg3 transition-colors disabled:opacity-50"
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
                className="flex items-center px-6 py-2 bg-bl5 text-bg1 rounded-lg hover:bg-bl7 transition-colors"
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
          <div className="mb-6 p-4 bg-rd1 border border-rd2 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-rd5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-rd7">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { status: 'all', label: 'Total', color: 'bg-bg5' },
            { status: 'pending', label: 'Pending', color: 'bg-yl5' },
            { status: 'approved', label: 'Approved', color: 'bg-gr5' },
            { status: 'completed', label: 'Completed', color: 'bg-bl5' },
            { status: 'rejected', label: 'Rejected', color: 'bg-rd5' },
            { status: 'cancelled', label: 'Cancelled', color: 'bg-bg4' },
          ].map(({ status, label, color }) => (
            <div
              key={status}
              className={`bg-bg1 rounded-lg shadow-sm border border-bg2 p-4 cursor-pointer transition-all hover:shadow-md ${
                filterStatus === status ? 'ring-2 ring-bl5' : ''
              }`}
              onClick={() => setFilterStatus(status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-bg9">{statusCounts[status as keyof typeof statusCounts]}</p>
                  <p className="text-sm text-bg6">{label}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-bg1 rounded-lg shadow-sm border border-bg2 p-12 text-center">
            <svg className="w-16 h-16 text-bg4 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-bg9 mb-2">
              {appointments.length === 0 ? 'No appointments yet' : 'No appointments found'}
            </h3>
            <p className="text-bg5 mb-6">
              {appointments.length === 0 
                ? 'Get started by booking your first appointment with our doctors.'
                : `No appointments found with status "${filterStatus}".`
              }
            </p>
            <button
              onClick={handleBookNew}
              className="inline-flex items-center px-6 py-3 bg-bl6 text-bg1 rounded-lg hover:bg-bl7 transition-colors"
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
                className="bg-bg1 rounded-lg shadow-sm border border-bg2 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {appointment.doctor.imageUrl ? (
                          <img
                            src={appointment.doctor.imageUrl}
                            alt={appointment.doctor.username}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-bl4 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-bl6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-bg9">
                              Dr. {appointment.doctor.username}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              <span className="mr-1">{getStatusIcon(appointment.status)}</span>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-bg6 mb-1">{appointment.doctor.specialization}</p>
                          {appointment.doctor.hospital && (
                            <p className="text-bg5 text-sm">{appointment.doctor.hospital}</p>
                          )}
                          {appointment.doctor.consultationFee && (
                            <p className="text-gr6 font-semibold mt-1">
                              ₹{appointment.doctor.consultationFee} Consultation Fee
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="lg:w-80 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-bg5">Patient:</span>
                        <span className="font-medium text-bg9">{appointment.patientName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-bg5">Type:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAppointmentTypeColor(appointment.appointmentType)}`}>
                          {appointment.appointmentType.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-bg5">Booked:</span>
                        <span className="font-medium text-bg9" title={formatDate(appointment.createdAt)}>
                          {getTimeAgo(appointment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms and Notes */}
                  <div className="mt-6 pt-6 border-t border-bg1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-bg7 mb-2">Symptoms / Reason</h4>
                        <p className="text-sm text-b3g6 bg-bg1 rounded-lg p-3">
                          {appointment.symptoms}
                        </p>
                      </div>
                      {appointment.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-bg7 mb-2">Additional Notes</h4>
                          <p className="text-sm text-bg6 bg-bg1 rounded-lg p-3">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-bg1 flex items-center justify-between text-sm text-bg5">
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