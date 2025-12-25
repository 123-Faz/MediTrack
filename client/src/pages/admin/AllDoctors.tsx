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
  MapPin,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type{userLayoutContextType} from "@/layout/adminDashboard/types"
import { useOutletContext } from 'react-router-dom';

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

  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'All Doctors'])
  }, [setBreadcrumb])
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
      
      const token = getCookie('admin_token');
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
    if (experience >= 10) return 'bg-ppl1 text-ppl6';
    if (experience >= 5) return 'bg-bl1 text-bl6';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bl6 mx-auto mb-4"></div>
          <p className="text-fg1-4 text-lg font-semibold">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error && !showScheduleModal) {
    return (
      <div className="min-h-screen bg-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rd1 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rd6" />
          </div>
          <h3 className="text-lg font-semibold text-fg0 mb-2">Unable to Load Doctors</h3>
          <p className="text-fg1-4 mb-4">{error}</p>
          <button
            onClick={fetchDoctors}
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
          <h1 className="text-3xl lg:text-4xl font-bold text-bl5 text-center mb-2">
            Doctor Management 👨‍⚕️
          </h1>
          <p className="text-bg6 text-lg text-center">
            Manage doctors and assign schedules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Doctors */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-bl1 rounded-xl">
                <Users className="w-6 h-6 text-bl5" />
              </div>
              <TrendingUp className="w-5 h-5 text-gr6" />
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{doctors.length}</h3>
            <p className="text-fg1-4 font-medium">Total Doctors</p>
            <div className="mt-3 pt-3 border-t border-bg3">
              <span className="text-bl6 font-medium text-sm">
                {getSpecializations().length} specializations
              </span>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gr1 rounded-xl">
                <Stethoscope className="w-6 h-6 text-gr6" />
              </div>
              <span className="text-gr6 bg-gr1 px-2 py-1 rounded-lg text-sm font-bold">
                {getSpecializations().length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{getSpecializations().length}</h3>
            <p className="text-fg1-4 font-medium">Specializations</p>
          </div>

          {/* Experienced Doctors */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yl1 rounded-xl">
                <Award className="w-6 h-6 text-yl6" />
              </div>
              <span className="text-bl5 bg-bl7 px-2 py-1 rounded-lg text-sm font-bold">
                {doctors.filter(d => d.experience >= 5).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">
              {doctors.filter(d => d.experience >= 5).length}
            </h3>
            <p className="text-fg1-4 font-medium">Experienced (5+ yrs)</p>
          </div>

          {/* Senior Doctors */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-ppl1 rounded-xl">
                <Award className="w-6 h-6 text-ppl5" />
              </div>
              <span className="text-ppl5 bg-ppl1 px-2 py-1 rounded-lg text-sm font-bold">
                {doctors.filter(d => d.experience >= 10).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">
              {doctors.filter(d => d.experience >= 10).length}
            </h3>
            <p className="text-fg1-4 font-medium">Senior (10+ yrs)</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg1-4 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg1-4 w-5 h-5" />
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 appearance-none cursor-pointer themeShift"
                >
                  <option value="all">All Specializations</option>
                  {getSpecializations().map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-12 text-center">
            <Users className="w-16 h-16 text-bg4 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg0 mb-2">No doctors found</h3>
            <p className="text-fg1-4">
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
                className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group"
              >
                {/* Doctor Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-bl6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6 text-bl4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-fg0 text-lg">Dr. {doctor.username}</h3>
                      <p className="text-sm text-fg1-5">Medical Professional</p>
                    </div>
                  </div>
                </div>

                {/* Specialization and Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-bl4" />
                    <span className="text-sm font-semibold text-fg0 capitalize">
                      {doctor.specialization}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(doctor.experience)}`}>
                    {doctor.experience}+ years
                  </span>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-fg1-4">
                    <MapPin className="w-4 h-4" />
                    <span>Available for scheduling</span>
                  </div>
                  {doctor.email && (
                    <div className="text-sm text-fg1-5 truncate">
                      📧 {doctor.email}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openScheduleModal(doctor)}
                  className="w-full bg-gr5 text-white py-3 px-4 rounded-xl hover:bg-gr4 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
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
            <div className="bg-bg1 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-bg3">
              <div className="p-6 border-b border-bg3">
                <h3 className="text-2xl font-bold text-fg0">
                  Assign Schedule
                </h3>
                <p className="text-fg1-4 mt-2">
                  For Dr. <span className="font-semibold text-bl6">{selectedDoctor.username}</span> - {selectedDoctor.specialization}
                </p>
              </div>

              <form onSubmit={assignSchedule} className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-rd1 border border-rd2 rounded-xl">
                    <p className="text-rd8">{error}</p>
                  </div>
                )}

                {scheduleSuccess && (
                  <div className="mb-6 p-4 bg-gr1 border border-gr2 rounded-xl">
                    <p className="text-gr8 font-semibold">
                      ✅ Schedule assigned successfully! Redirecting...
                    </p>
                  </div>
                )}

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
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
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
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
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                    />
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
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
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
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
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                    />
                  </div>
                </div>

                {/* Schedule Preview */}
                {(scheduleForm.startDate || scheduleForm.endDate) && (
                  <div className="mb-6 p-4 bg-bl1 rounded-xl border border-bl2">
                    <h4 className="font-semibold text-bl6 mb-2">Schedule Preview</h4>
                    <div className="text-sm text-bl6 space-y-1">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {scheduleForm.startDate} to {scheduleForm.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timing:</span>
                        <span className="font-medium">
                          {scheduleForm.startTime} - {scheduleForm.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-bg3">
                  <button
                    type="button"
                    onClick={closeScheduleModal}
                    className="flex-1 px-4 py-3 border border-bg3 text-fg1-4 rounded-xl hover:bg-bg2 transition-colors hover:border-fg1-5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduleLoading || scheduleSuccess}
                    className="flex-1 px-4 py-3 bg-gr6 text-white rounded-xl hover:bg-gr7 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
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