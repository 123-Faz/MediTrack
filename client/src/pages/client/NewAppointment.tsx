// components/NewAppointment.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  name: string;
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
        // Handle validation errors from backend
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to book appointment');
      }

      setSuccess('Appointment requested successfully!');
      
      // Reset form
      setFormData({
        doctorId: doctorIdFromState || '',
        patientName: '',
        appointmentType: 'consultation',
        symptoms: '',
        notes: ''
      });
      
      // Redirect to appointments list after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/newappoinments');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error booking appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get selected doctor details for display
  const selectedDoctor = selectedDoctorFromState || 
    doctors.find(doctor => doctor._id === formData.doctorId);

  if (doctorsLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book New Appointment</h1>
        <p className="text-gray-600">Fill in the details to request an appointment</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

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

      {/* Selected Doctor Info */}
      {selectedDoctor && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Selected Doctor</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">Dr. {selectedDoctor.name}</p>
              <p className="text-blue-600 text-sm">{selectedDoctor.specialization}</p>
              {selectedDoctor.hospital && (
                <p className="text-blue-600 text-sm">{selectedDoctor.hospital}</p>
              )}
            </div>
            {selectedDoctor.consultationFee && (
              <div className="text-right">
                <p className="text-blue-800 font-semibold">
                  ₹{selectedDoctor.consultationFee}
                </p>
                <p className="text-blue-600 text-sm">Consultation Fee</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Doctor Selection - Only show if no pre-selected doctor */}
          {!doctorIdFromState && (
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor *
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                    {doctor.consultationFee && ` (₹${doctor.consultationFee})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter patient's full name"
            />
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type *
            </label>
            <select
              id="appointmentType"
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="checkup">Routine Checkup</option>
              <option value="emergency">Emergency</option>
              <option value="surgery">Surgery Consultation</option>
              <option value="therapy">Therapy Session</option>
            </select>
          </div>

          {/* Symptoms */}
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms / Reason for Visit *
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Describe your symptoms or reason for the appointment in detail..."
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAppointment;