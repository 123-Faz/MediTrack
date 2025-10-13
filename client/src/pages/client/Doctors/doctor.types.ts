// types/doctor.ts
export interface Doctor {
  _id: string;
  username: string;
  specialization: string;
  experience: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  bio?: string;
}