// components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  UserCheck,
  Stethoscope,
  MapPin
} from 'lucide-react';

interface Doctor {
  _id: string;
  username: string;
  specialization: string;
  experience: number;
  email?: string;
  phone?: string;
}

interface ScheduleFormData {
  doctorId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

const AdminDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    doctorId: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, specializationFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getCookie('admin_token'); // Assuming admin token in cookies
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/admin/get-all-drs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);

    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load doctors');
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

  const filterDoctors = () => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialization.toLowerCase() === specializationFilter.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  };

  const getSpecializations = () => {
    const specializations = doctors.map(doctor => doctor.specialization);
    return [...new Set(specializations)];
  };

  const openScheduleModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setScheduleForm({
      doctorId: doctor._id,
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00'
    });
    setScheduleSuccess(false);
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedDoctor(null);
    setScheduleForm({
      doctorId: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  const assignSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setScheduleLoading(true);
      setError(null);

      const token = getCookie('admin_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Validation
      if (!scheduleForm.startDate || !scheduleForm.endDate) {
        setError('Please select both start and end dates');
        return;
      }

      if (new Date(scheduleForm.startDate) > new Date(scheduleForm.endDate)) {
        setError('End date cannot be before start date');
        return;
      }

      if (scheduleForm.startTime >= scheduleForm.endTime) {
        setError('End time must be after start time');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/admin/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scheduleForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign schedule');
      }

      const data = await response.json();
      console.log('Schedule assigned:', data);

      setScheduleSuccess(true);
      setTimeout(() => {
        closeScheduleModal();
        fetchDoctors(); // Refresh doctors list
      }, 2000);

    } catch (err) {
      console.error('Error assigning schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign schedule');
    } finally {
      setScheduleLoading(false);
    }
  };

  const getExperienceColor = (experience: number) => {
    if (experience >= 10) return 'bg-purple-100 text-purple-800';
    if (experience >= 5) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error && !showScheduleModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Doctors</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDoctors}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Doctor Management</h1>
          <p className="text-xl text-gray-600">Manage doctors and assign schedules</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
              <div className="text-sm text-gray-600">Total Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getSpecializations().length}
              </div>
              <div className="text-sm text-gray-600">Specializations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {doctors.filter(d => d.experience >= 5).length}
              </div>
              <div className="text-sm text-gray-600">Experienced (5+ yrs)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {doctors.filter(d => d.experience >= 10).length}
              </div>
              <div className="text-sm text-gray-600">Senior (10+ yrs)</div>
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
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="flex gap-2">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Specializations</option>
                {getSpecializations().map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">
              {doctors.length === 0 
                ? "No doctors are registered in the system." 
                : "No doctors match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
              >
                {/* Doctor Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{doctor.username}</h3>
                      <p className="text-sm text-gray-600">Medical Professional</p>
                    </div>
                  </div>
                </div>

                {/* Specialization and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {doctor.specialization}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(doctor.experience)}`}>
                    {doctor.experience}+ years
                  </span>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Available for scheduling</span>
                  </div>
                  {doctor.email && (
                    <div className="text-sm text-gray-600 truncate">
                      📧 {doctor.email}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openScheduleModal(doctor)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Assign Schedule
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Assignment Modal */}
        {showScheduleModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  Assign Schedule
                </h3>
                <p className="text-gray-600 mt-2">
                  For Dr. {selectedDoctor.username} - {selectedDoctor.specialization}
                </p>
              </div>

              <form onSubmit={assignSchedule} className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {scheduleSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-800 font-semibold">
                      ✅ Schedule assigned successfully! Redirecting...
                    </p>
                  </div>
                )}

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.startDate}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        startDate: e.target.value 
                      }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.endDate}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        endDate: e.target.value 
                      }))}
                      min={scheduleForm.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.startTime}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        startTime: e.target.value 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.endTime}
                      onChange={(e) => setScheduleForm(prev => ({ 
                        ...prev, 
                        endTime: e.target.value 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Schedule Preview */}
                {(scheduleForm.startDate || scheduleForm.endDate) && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Schedule Preview</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>
                          {scheduleForm.startDate} to {scheduleForm.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timing:</span>
                        <span>
                          {scheduleForm.startTime} - {scheduleForm.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeScheduleModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduleLoading || scheduleSuccess}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {scheduleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Assign Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;