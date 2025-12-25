// pages/doctors.tsx
import React from 'react';
import DoctorList from '../DoctorList';

const DoctorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorList />
    </div>
  );
};

export default DoctorsPage;