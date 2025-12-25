// components/NewAppointment.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { userLayoutContextType } from "@/layout/userDashboard/types";
import { useOutletContext } from "react-router-dom";
// components/appointment.types.ts
export interface AppointmentFormData {
  doctorId: string;
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
}

export interface AppointmentResponse {
  _id: string;
  doctor: string;
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  status: string;
}

export interface ApiResponse {
  message: string;
  appointment: AppointmentResponse;
}

export interface Doctor {
  _id: string;
  username: string;
  specialization: string;
  email: string;
  phoneNumber: string;
  experience: number;
  consultationFee: number;
  availability: string[];
  bio?: string;
  education?: string[];
  hospital?: string;
  rating?: number;
  imageUrl?: string;
}

// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const NewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get doctorId from location state
  const doctorIdFromState = location.state?.doctorId;
  const selectedDoctorFromState = location.state?.doctor as Doctor | undefined;

  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: doctorIdFromState || '',
    patientName: '',
    appointmentType: 'consultation',
    symptoms: '',
    notes: ''
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(!doctorIdFromState);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
    const {setBreadcrumb} = useOutletContext<userLayoutContextType>();
  
    useEffect(() => {
      setBreadcrumb(['Dashboard', 'New Appointments'])
    }, [setBreadcrumb])

  // Fetch doctors for dropdown if no specific doctor is selected
  useEffect(() => {
    if (!doctorIdFromState) {
      fetchDoctors();
    }
  }, [doctorIdFromState]);

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
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
      setDoctorsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        body: JSON.stringify(formData),
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

      setSuccess('Appointment requested successfully!');

      setFormData({
        doctorId: doctorIdFromState || '',
        patientName: '',
        appointmentType: 'consultation',
        symptoms: '',
        notes: ''
      });

      setTimeout(() => {
        navigate('/dashboard/newappoinments');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error booking appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-bg2 py-8 themeShift">
      <div className="max-w-4xl mx-auto p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bl5 mb-3 ">
            Book Your Appointment
          </h1>
          <p className="text-lg text-fg1-4">Schedule your consultation with healthcare experts</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-gr1 border border-gr3 rounded-xl animate-in fade-in duration-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gr6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gr8 font-semibold">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rd1 border border-rd3 rounded-xl animate-in fade-in duration-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-rd6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-rd8 font-semibold">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Appointment Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 md:p-8">
              <div className="space-y-6">
                Doctor Selection - Only show if no pre-selected doctor
                {!doctorIdFromState && (
                  <div>
                    <label className="block text-sm font-bold text-fg0 mb-3">
                      Select Doctor *
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-bold text-fg0 mb-3">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
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
                      value={formData.appointmentType}
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
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-bold text-fg0 mb-3">
                    Symptoms / Reason for Visit *
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
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
                    value={formData.notes}
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
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 border border-bg3 text-fg1-6 rounded-xl hover:bg-bg2 hover:border-bl4 hover:text-bl6 transition-all duration-200 font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 bg-bl6 text-white rounded-xl hover:from-bl7 hover:to-bl8 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
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
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;