export interface Doctor {
  _id: string;
  username: string;
  specialization: string;
  experience: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  bio?: string;
  consultationFee?: number;
  hospital?: string;
  rating?: number;
  availability?: string[];
  education?: string[];
}

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