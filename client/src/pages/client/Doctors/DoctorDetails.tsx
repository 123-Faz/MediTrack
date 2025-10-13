// components/DoctorDetails.tsx
import React from "react";
import type { Doctor } from "./doctor.types";
import { useNavigate } from "react-router-dom";

interface DoctorDetailsProps {
  doctor: Doctor;
  onClose: () => void;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor, onClose }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    onClose(); // Close the details modal
    navigate("/dashboard/newappoinments", {
      state: {
        doctorId: doctor._id,
        doctor: doctor,
      },
    });
  };
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Doctor Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <img
              src={doctor.profileImage || "/default-avatar.png"}
              alt={`Dr. ${doctor.username}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Dr. {doctor.username}
              </h2>
              <p className="text-xl text-blue-600 font-semibold mb-4">
                {doctor.specialization}
              </p>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  {doctor.experience} of experience
                </span>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Specialization:
                  </span>
                  <p className="text-gray-900">{doctor.specialization}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Experience:
                  </span>
                  <p className="text-gray-900">{doctor.experience}</p>
                </div>
                {doctor.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Email:
                    </span>
                    <p className="text-gray-900">{doctor.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About Dr. {doctor.username}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {doctor.bio ||
                  `Dr. ${doctor.username} is a highly qualified ${doctor.specialization} with ${doctor.experience} of experience in providing exceptional medical care. Committed to patient well-being and staying updated with the latest medical advancements.`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Book Appointment
            </button>
            <div className="flex gap-4 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
