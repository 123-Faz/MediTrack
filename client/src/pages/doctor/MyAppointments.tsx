// components/DoctorAppointments.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Stethoscope, AlertCircle, CheckCircle2, Search } from 'lucide-react';

interface Appointment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
  updatedAt: string;
}

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, upcoming, past

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getCookie('doctor_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth_doctor/all-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      const allAppointments = data.appointments || data.data || [];
      
      // Filter only approved appointments
      const approvedAppointments = allAppointments.filter((apt: Appointment) => 
        apt.status === 'approved' || apt.status === 'confirmed'
      );
      
      setAppointments(approvedAppointments);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
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

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.appointmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() >= today.getTime();
        });
        break;
      case 'past':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() < today.getTime();
        });
        break;
      default:
        // 'all' - no date filtering
        break;
    }

    // Sort by date and time (soonest first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getAppointmentStatus = (appointment: Appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
    
    if (now > appointmentDateTime) {
      return { text: 'Completed', color: 'bg-gray-100 text-gray-800', icon: '✅' };
    }
    
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      return { text: 'Today', color: 'bg-orange-100 text-orange-800', icon: '⏰' };
    }
    
    return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800', icon: '📅' };
  };

  const getUrgencyColor = (symptoms: string) => {
    const urgentKeywords = ['emergency', 'severe', 'critical', 'chest pain', 'shortness of breath', 'bleeding'];
    const symptomsLower = symptoms.toLowerCase();
    
    if (urgentKeywords.some(keyword => symptomsLower.includes(keyword))) {
      return 'border-red-200 bg-red-50';
    }
    
    return 'border-gray-200 bg-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Appointments</h1>
          <p className="text-xl text-gray-600">Manage and prepare for your confirmed patient appointments</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
              <div className="text-sm text-gray-600">Total Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => {
                  const aptDate = new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
                  return aptDate > new Date();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {appointments.filter(apt => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const aptDate = new Date(apt.appointmentDate);
                  aptDate.setHours(0, 0, 0, 0);
                  return aptDate.getTime() === today.getTime();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {appointments.filter(apt => apt.appointmentType === 'consultation').length}
              </div>
              <div className="text-sm text-gray-600">Consultations</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name, type, or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">
              {appointments.length === 0 
                ? "You don't have any approved appointments yet." 
                : "No appointments match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment);
              const urgencyClass = getUrgencyColor(appointment.symptoms);
              
              return (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 ${urgencyClass}`}
                >
                  {/* Header with Patient Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{appointment.appointmentType}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.icon} {status.text}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatTime(appointment.appointmentTime)}
                      </span>
                    </div>

                    {appointment.user?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">{appointment.user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Symptoms */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-gray-900">Symptoms</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{appointment.symptoms}</p>
                  </div>

                  {/* Additional Notes */}
                  {appointment.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Notes:</span> {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(appointment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">CONFIRMED</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions Footer */}
        {appointments.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Your Appointments?</h3>
              <p className="text-gray-600 mb-4">
                You have {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} to prepare for
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={fetchAppointments}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Appointments
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
