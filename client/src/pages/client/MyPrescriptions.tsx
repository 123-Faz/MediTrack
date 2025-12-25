import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { useOutletContext } from "react-router-dom";
// components/prescription.types.ts
export interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionFile {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_at: string;
}

export interface Prescription {
  _id: string;
  appointment_id: {
    _id: string;
    patientName: string;
    appointmentType: string;
    appointmentDate: string;
    createdAt: string;
  };
  doctor_id: {
    _id: string;
    name: string;
    specialization: string;
    experience: number;
  } | null;
  medications: Medication[];
  files: PrescriptionFile[];
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  created_at: string;
}

export interface PrescriptionsResponse {
  message: string;
  data: Prescription[];
}

// components/MyPrescriptions.tsx
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const MyPrescriptions: React.FC = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();
  
    useEffect(() => {
      setBreadcrumb(['Dashboard', 'My Prescriptions'])
    }, [setBreadcrumb])
  useEffect(() => {
    fetchPrescriptions();
  }, [selectedAppointment]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getCookie('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      let url = 'http://localhost:8000/api/v1/user/psp';
      if (selectedAppointment) {
        url += `?appointment_id=${selectedAppointment}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: PrescriptionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch prescriptions');
      }

      setPrescriptions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPrescriptions();
  };

  const handleViewAppointments = () => {
    navigate('/appointments');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gr1 text-gr8 border-gr2';
      case 'expired':
        return 'bg-rd1 text-rd8 border-rd2';
      case 'completed':
        return 'bg-bl1 text-bl8 border-bl2';
      case 'cancelled':
        return 'bg-bg1 text-bg8 border-bg2';
      default:
        return 'bg-yl1 text-yl8 border-yl2';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '💊';
      case 'expired':
        return '⏰';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '🚫';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const downloadFile = async (file: PrescriptionFile) => {
    try {
      const response = await fetch(`http://localhost:8000${file.url}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  const filteredPrescriptions = filterStatus === 'all'
    ? prescriptions
    : prescriptions.filter(script => script.status === filterStatus);

  const statusCounts = {
    all: prescriptions.length,
    active: prescriptions.filter(script => script.status === 'active').length,
    expired: prescriptions.filter(script => script.status === 'expired').length,
    completed: prescriptions.filter(script => script.status === 'completed').length,
    cancelled: prescriptions.filter(script => script.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg2 py-8">
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
              <p className="text-bl5 text-2xl font-bold mb-2 text-center">View and manage your medical prescriptions</p>
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
                onClick={handleViewAppointments}
                className="flex items-center px-6 py-2 bg-bl5 text-bg1 rounded-lg hover:bg-bl7 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Appointments
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { status: 'all', label: 'Total', color: 'bg-bg5' },
            { status: 'active', label: 'Active', color: 'bg-gr5' },
            { status: 'expired', label: 'Expired', color: 'bg-rd5' },
            { status: 'completed', label: 'Completed', color: 'bg-bl5' },
            { status: 'cancelled', label: 'Cancelled', color: 'bg-bg4' },
          ].map(({ status, label, color }) => (
            <div
              key={status}
              className={`bg-bg1 rounded-lg shadow-sm border border-bg2 p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === status ? 'ring-2 ring-bl5' : ''
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

        {/* Appointment Filter */}
        <div className="mb-6">
          <label htmlFor="appointment-filter" className="block text-sm font-medium text-bg7 mb-2">
            Filter by Appointment
          </label>
          <select
            id="appointment-filter"
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full md:w-64 bg-bg1 border border-bg3 rounded-lg px-3 py-2 text-bg9 focus:outline-none focus:ring-2 focus:ring-bl5 focus:border-transparent"
          >
            <option value="">All Appointments</option>
            {/* You can populate this with user's appointments */}
          </select>
        </div>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-bg1 rounded-lg shadow-sm border border-bg2 p-12 text-center">
            <svg className="w-16 h-16 text-bg4 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-bg9 mb-2">
              {prescriptions.length === 0 ? 'No prescriptions yet' : 'No prescriptions found'}
            </h3>
            <p className="text-bg5 mb-6">
              {prescriptions.length === 0
                ? 'Your prescriptions will appear here after doctor consultations.'
                : `No prescriptions found with status "${filterStatus}".`
              }
            </p>
            <button
              onClick={handleViewAppointments}
              className="inline-flex items-center px-6 py-3 bg-bl5 text-bg1 rounded-lg hover:bg-bl7 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Appointments
            </button>
          </div>
        ) : (

          <div className="space-y-6">
            {filteredPrescriptions.map((prescription) => {
              // Add null checks here
              const appointment = prescription.appointment_id || {};
              const doctor = prescription.doctor_id || null;

              return (
                <div
                  key={prescription._id}
                  className="bg-bg1 rounded-lg shadow-sm border border-bg2 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-semibold text-bg9">
                            Prescription #{prescription._id?.slice(-8) || 'N/A'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                            <span className="mr-1">{getStatusIcon(prescription.status)}</span>
                            {prescription.status?.charAt(0).toUpperCase() + prescription.status?.slice(1) || 'Unknown'}
                          </span>
                          {prescription.expiry_date && isExpiringSoon(prescription.expiry_date) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yl1 text-yl8 border border-yl2">
                              ⚠️ Expiring Soon
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-bg5">Patient: </span>
                            <span className="font-medium text-bg9">{appointment.patientName || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-bg5">Appointment: </span>
                            <span className="font-medium text-bg9">
                              {appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'Not specified'}
                            </span>
                          </div>
                          <div>
                            <span className="text-bg5">Issued: </span>
                            <span className="font-medium text-bg9">
                              {prescription.issue_date ? formatDate(prescription.issue_date) : 'Not specified'}
                            </span>
                          </div>
                          <div>
                            <span className="text-bg5">Expires: </span>
                            <span className={`font-medium ${prescription.expiry_date && isExpired(prescription.expiry_date) ? 'text-rd6' : 'text-bg9'
                              }`}>
                              {prescription.expiry_date ? formatDate(prescription.expiry_date) : 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      {doctor && (
                        <div className="lg:w-64 bg-bg2 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-bg7 mb-2">Prescribed by</h4>
                          <p className="font-semibold text-bg9">Dr. {doctor.name || 'Unknown'}</p>
                          <p className="text-sm text-bg6">{doctor.specialization || 'Not specified'}</p>
                          <p className="text-xs text-bg5">{doctor.experience || '0'} years experience</p>
                        </div>
                      )}
                    </div>

                    {/* Medications */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-bg9 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-bl6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Medications ({prescription.medications?.length || 0})
                      </h4>
                      <div className="grid gap-3">
                        {prescription.medications?.map((med, index) => (
                          <div key={med._id || index} className="bg-bg2 rounded-lg p-4 border border-bg3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-bl1 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-bl6 font-semibold text-sm">{index + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-bg9 mb-1">{med.name || 'Unnamed Medication'}</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                      <div>
                                        <span className="text-bg5">Dosage: </span>
                                        <span className="font-medium text-bg9">{med.dosage || 'Not specified'}</span>
                                      </div>
                                      <div>
                                        <span className="text-bg5">Frequency: </span>
                                        <span className="font-medium text-bg9">{med.frequency || 'Not specified'}</span>
                                      </div>
                                      <div>
                                        <span className="text-bg5">Duration: </span>
                                        <span className="font-medium text-bg9">{med.duration || 'Not specified'}</span>
                                      </div>
                                    </div>
                                    {med.instructions && (
                                      <div className="mt-2">
                                        <span className="text-bg5 text-sm">Instructions: </span>
                                        <span className="text-bg9 text-sm">{med.instructions}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )) || (
                            <div className="text-center text-bg5 py-4">
                              No medications found
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Files */}
                    {prescription.files && prescription.files.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-bg9 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-bl6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Attached Files ({prescription.files.length})
                        </h4>
                        <div className="grid gap-2">
                          {prescription.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-bg2 rounded-lg p-3 border border-bg3">
                              <div className="flex items-center gap-3">
                                <svg className="w-8 h-8 text-bl6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <p className="font-medium text-bg9">{file.original_name || 'Unknown file'}</p>
                                  <p className="text-sm text-bg5">
                                    {file.size ? `${Math.round(file.size / 1024)} KB` : 'Size unknown'} •
                                    {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : 'Date unknown'}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => downloadFile(file)}
                                className="flex items-center px-3 py-1 bg-bl6 text-bg1 rounded-lg hover:bg-bl7 transition-colors text-sm"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-6 border-t border-bg3 flex items-center justify-between text-sm text-bg5">
                      <div>
                        Prescription ID: <span className="font-mono">{prescription._id?.slice(-8) || 'N/A'}</span>
                      </div>
                      <div title={prescription.created_at ? formatDateTime(prescription.created_at) : 'Unknown'}>
                        Created: {prescription.created_at ? formatDateTime(prescription.created_at) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;