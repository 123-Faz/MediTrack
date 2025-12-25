// components/DoctorManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Doctor, AppointmentFormData } from './Doctors/doctor.types';
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { useOutletContext } from "react-router-dom";

// Utility function to get cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const DoctorManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'appointment'>('list');

  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
    doctorId: '',
    patientName: '',
    appointmentType: 'consultation',
    symptoms: '',
    notes: ''
  });
  const [appointmentLoading, setAppointmentLoading] = useState(false);

  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'All Doctors'])
  }, [setBreadcrumb])
  // Check if we're coming from a direct booking
  useEffect(() => {
    const doctorFromState = location.state?.doctor;
    const doctorIdFromState = location.state?.doctorId;

    if (doctorFromState || doctorIdFromState) {
      setActiveView('appointment');
      if (doctorFromState) {
        setSelectedDoctor(doctorFromState);
        setAppointmentForm(prev => ({
          ...prev,
          doctorId: doctorFromState._id
        }));
      }
    }

    fetchDoctors();
  }, [location]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = getCookie('token');

      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch('http://localhost:8000/api/v1/user/get-all-drs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading doctors');
    } finally {
      setLoading(false);
    }
  };

  // Doctor Card Component with Modern Design
  const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
    <div className="flex flex-col w-full max-w-[320px] h-[480px] mx-auto">
      <div className="bg-bg1 rounded-2xl shadow-lg hover:shadow-xl border border-bg2 overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

        {/* Profile Section */}
        <div className="p-6 flex-grow">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-bl5 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={`Dr. ${doctor.username}`}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {doctor.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-fg0 text-lg">
                Dr. {doctor.username}
              </h3>
              <p className="text-bl5 font-semibold">
                {doctor.specialization}
              </p>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1.5 bg-bg2 text-fg1-6 rounded-full text-sm font-medium">
              Consultation
            </span>
            <span className="px-3 py-1.5 bg-bg2 text-fg1-6 rounded-full text-sm font-medium">
              Healthcare
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 text-fg1-4">
              <div className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4 text-bl5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="line-clamp-5 leading-relaxed">
                  {doctor.experience}
                </span>
              </div>
            </div>

            {/* Add more details if available */}
            {doctor.hospital && (
              <div className="flex items-center gap-3 text-fg1-4">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-bl5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="truncate">{doctor.hospital}</span>
              </div>
            )}

            {doctor.consultationFee && (
              <div className="flex items-center gap-3 text-fg1-4">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span>₹{doctor.consultationFee} consultation fee</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-bg2 p-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleViewDetails(doctor)}
              className="flex flex-col items-center justify-center p-2 bg-bg2 hover:bg-bg3 text-fg1-6 rounded-lg transition-colors border border-bg3 hover:border-bl4 hover:text-bl6"
            >
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">Details</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/newappoinments')}
              className="flex flex-col items-center justify-center p-2 bg-bl5 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Doctor Details Modal
  const DoctorDetailsModal: React.FC<{ doctor: Doctor; onClose: () => void }> = ({ doctor, onClose }) => (
    <div className="fixed inset-0 bg-bg5/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg1 rounded-2xl shadow-xl max-w-2xl w-full border border-bg2 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-bg2 rounded-xl transition-colors"
        >
         X
        </button>

        <div className="p-6">
          {/* Doctor Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-bl5 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={`Dr. ${doctor.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                doctor.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-fg0">Dr. {doctor.username}</h2>
              <p className="text-bl5 font-semibold text-sm">{doctor.specialization}</p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4 mb-6">
            <div className="bg-bg2 rounded-xl p-4">
              <h3 className="font-semibold text-fg0 mb-3">Professional Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-fg1-5 mb-1">Specialization</p>
                  <p className="text-fg0 font-medium">{doctor.specialization}</p>
                </div>

                <div>
                  <p className="text-sm text-fg1-5 mb-1">Experience</p>
                  <p className="text-fg0 font-medium">{doctor.experience}</p>
                </div>

                {doctor.email && (
                  <div>
                    <p className="text-sm text-fg1-5 mb-1">Email</p>
                    <p className="text-fg0 font-medium text-sm break-all">{doctor.email}</p>
                  </div>
                )}

                {doctor.consultationFee && (
                  <div>
                    <p className="text-sm text-fg1-5 mb-1">Consultation Fee</p>
                    <p className="text-lg font-bold text-bl6">₹{doctor.consultationFee}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-bg2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-bg3 text-fg1-6 rounded-xl hover:bg-bg2 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => navigate('/dashboard/newappoinments')}
              className="flex-1 px-4 py-3 bg-bl5 text-white rounded-xl transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Appointment Form View
  const AppointmentFormView: React.FC = () => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setAppointmentForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAppointmentLoading(true);
      setError('');
      setSuccess('');

      try {
        const token = getCookie('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch('http://localhost:8000/api/v1/user/req-appt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(appointmentForm),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            const errorMessages = Object.values(data.errors).join(', ');
            throw new Error(errorMessages);
          }
          throw new Error(data.message || 'Failed to book appointment');
        }

        setSuccess('Appointment requested successfully! Redirecting...');

        setTimeout(() => {
          navigate('/dashboard/appointments', {
            state: { message: 'Appointment booked successfully!' }
          });
        }, 2000);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error booking appointment. Please try again.');
      } finally {
        setAppointmentLoading(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setActiveView('list')}
            className="flex items-center text-bl6 mb-6 font-semibold transition-colors themeShift"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Doctors List
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-fg0 mb-3 bg-bl6 bg-clip-text text-transparent">
              Book Your Appointment
            </h1>
            <p className="text-lg text-fg1-4">Schedule your consultation with healthcare experts</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gr1 border border-gr3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gr6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gr8 font-semibold">{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rd1 border border-rd3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-rd6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-rd8 font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Selected Doctor Info */}
        {selectedDoctor && (
          <div className="mb-8 bg-bl3 border border-bl3 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-fg0 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-bl6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Selected Doctor
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDoctor.profileImage || '/default-avatar.png'}
                  alt={`Dr. ${selectedDoctor.username}`}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-bl3"
                />
                <div>
                  <p className="text-xl font-bold text-fg0">Dr. {selectedDoctor.username}</p>
                  <p className="text-fg0 font-semibold">{selectedDoctor.specialization}</p>
                  {selectedDoctor.hospital && (
                    <p className="text-fg1-4 text-sm">{selectedDoctor.hospital}</p>
                  )}
                </div>
              </div>
              {selectedDoctor.consultationFee && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-bl6">₹{selectedDoctor.consultationFee}</p>
                  <p className="text-fg1-4 text-sm">Consultation Fee</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointment Form */}
        <form onSubmit={handleSubmit} className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-8">
          <div className="space-y-6">
            {/* Doctor Selection - Only show if no pre-selected doctor */}
            {!selectedDoctor && (
              <div>
                <label className="block text-sm font-bold text-fg0 mb-3">
                  Select Doctor *
                </label>
                <select
                  name="doctorId"
                  value={appointmentForm.doctorId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.username} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-bold text-fg0 mb-3">
                Patient Name *
              </label>
              <input
                type="text"
                name="patientName"
                value={appointmentForm.patientName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                placeholder="Enter patient's full name"
              />
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-bold text-fg0 mb-3">
                Appointment Type *
              </label>
              <select
                name="appointmentType"
                value={appointmentForm.appointmentType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
              >
                <option value="consultation">General Consultation</option>
                <option value="follow-up">Follow-up Visit</option>
                <option value="checkup">Routine Checkup</option>
                <option value="emergency">Emergency Consultation</option>
                <option value="surgery">Surgery Consultation</option>
                <option value="therapy">Therapy Session</option>
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-bold text-fg0 mb-3">
                Symptoms / Reason for Visit *
              </label>
              <textarea
                name="symptoms"
                value={appointmentForm.symptoms}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift resize-vertical"
                placeholder="Please describe your symptoms or reason for the appointment in detail..."
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-bold text-fg0 mb-3">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={appointmentForm.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift resize-vertical"
                placeholder="Any additional information, previous treatments, or specific concerns..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                disabled={appointmentLoading}
                className="flex-1 px-6 py-3.5 border border-bg3 text-fg1-6 rounded-xl hover:bg-bg2 hover:border-bl4 hover:text-bl6 transition-all duration-200 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={appointmentLoading}
                className="flex-1 px-6 py-3.5 bg-bl6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {appointmentLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // Handler functions
  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleQuickBook = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentForm(prev => ({
      ...prev,
      doctorId: doctor._id
    }));
    setActiveView('appointment');
    setShowDetails(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDoctor(null);
  };

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];
  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : doctors;

  // Loading state
  if (loading && activeView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg1 to-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bl6 mx-auto mb-4"></div>
          <p className="text-fg1-4 text-lg font-semibold">Loading healthcare professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg2 themeShift">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'list' ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-bl5 mb-6">
                Find Your Healthcare Expert
              </h1>
              <p className="text-xl text-fg1-4 max-w-3xl mx-auto leading-relaxed">
                Connect with our team of experienced doctors and specialists for personalized
                medical care tailored to your needs
              </p>
            </div>

            {/* Filter Section */}
            <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 mb-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-bold text-fg0 mb-3">
                    Filter by Specialization
                  </label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-3.5 border border-bg3 bg-bg1 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="text-center lg:text-right">
                  <div className="text-3xl font-bold text-bl6">{filteredDoctors.length}</div>
                  <div className="text-sm text-fg1-4 font-semibold">Available Doctors</div>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-fg1-3 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-fg0 mb-3">No doctors found</h3>
                <p className="text-fg1-4 text-lg">Try adjusting your filter criteria or search terms</p>
              </div>
            ) : (
              // In your main component
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            )}
          </>
        ) : (
          <AppointmentFormView />
        )}

        {/* Doctor Details Modal */}
        {showDetails && selectedDoctor && (
          <DoctorDetailsModal
            doctor={selectedDoctor}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;