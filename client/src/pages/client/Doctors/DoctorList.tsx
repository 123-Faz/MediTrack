// components/DoctorList.tsx
import React, { useState, useEffect } from 'react';
import type { Doctor } from './doctor.types';
import DoctorCard from './DoctorCard';
import DoctorDetails from './DoctorDetails';

// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Get token from cookies
      const token = getCookie('token'); // or whatever your token cookie name is
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch('http://localhost:8000/api/v1/user/get-all-drs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Bearer token
        },
        credentials: 'include', // Include cookies if needed
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
      setError(err instanceof Error ? err.message : 'Error loading doctors. Please try again.');
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

  const filteredDoctors = selectedSpecialization 
    ? doctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : doctors;

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedDoctor(null);
  };

  // Handle authentication redirect
  const handleLoginRedirect = () => {
    // Redirect to login page or show login modal
    window.location.href = '/login'; // Adjust based on your routing
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        {error.includes('Authentication') ? (
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        ) : (
          <button
            onClick={fetchDoctors}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-gray-600">Choose from our experienced medical professionals</p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Specialization
              </label>
              <select
                id="specialization"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No doctors found matching your criteria.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Doctor Details Modal/Page */}
      {showDetails && selectedDoctor && (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default DoctorList;