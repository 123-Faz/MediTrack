// components/DoctorCard.tsx
import React from "react";
import type { Doctor } from "./doctor.types";
import { useNavigate } from "react-router-dom";
interface DoctorCardProps {
  doctor: Doctor;
  onViewDetails: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewDetails }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/dashboard/newappoinments", {
      state: {
        doctorId: doctor._id,
        doctor: doctor, // Pass the entire doctor object
      },
    });
  };
  return (
    <div className="bg-bg1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-bg1 overflow-hidden text-forgound">
      {/* Profile Image Section */}
      <div className="flex justify-center pt-6">
        <div className="relative">
          <img
            src={doctor.profileImage || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border-4 bg-bl1 border-bl1 shadow-md"
          />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-gr5 rounded-full border-2 border-bg1"></div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Dr. {doctor.username}
        </h3>

        <p className="text-gray-600 text-sm mb-3 font-medium">
          {doctor.specialization}
        </p>

        <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
          <svg
            className="w-4 h-4 mr-1 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{doctor.experience} of experience</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(doctor)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            View Details
          </button>
          <button
            onClick={handleBookAppointment}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
