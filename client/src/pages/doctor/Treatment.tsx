// components/TreatmentManagement.tsx
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Stethoscope, Calendar, User, Pill, Clock, Search, Upload, X } from 'lucide-react';

interface Appointment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormData {
  appointment_id: string;
  medications: Medication[];
  expiry_date: string;
  instructions: string;
  files: File[];
}

const TreatmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);

  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionFormData>({
    appointment_id: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    expiry_date: '',
    instructions: '',
    files: []
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getCookie('doctor_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth_doctor/all-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      const allAppointments = data.appointments || data.data || [];
      
      // Filter appointments that are approved/completed and can have prescriptions
      const treatableAppointments = allAppointments.filter((apt: Appointment) => 
        apt.status === 'approved' || apt.status === 'completed' || apt.status === 'confirmed'
      );
      
      setAppointments(treatableAppointments);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
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

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.appointmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    try {
      if (timeString.includes('am') || timeString.includes('pm')) {
        return timeString;
      }
      
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openPrescriptionModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionForm({
      appointment_id: appointment._id,
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      expiry_date: '',
      instructions: '',
      files: []
    });
    setPrescriptionSuccess(false);
    setShowPrescriptionModal(true);
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedAppointment(null);
    setPrescriptionForm({
      appointment_id: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      expiry_date: '',
      instructions: '',
      files: []
    });
  };

  const addMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    if (prescriptionForm.medications.length > 1) {
      setPrescriptionForm(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPrescriptionForm(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setPrescriptionForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const createPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setPrescriptionLoading(true);
      setError(null);

      const token = getCookie('doctor_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Validate form
      if (prescriptionForm.medications.some(med => !med.name || !med.dosage || !med.frequency || !med.duration)) {
        setError('Please fill all medication fields');
        return;
      }

      if (!prescriptionForm.expiry_date) {
        setError('Expiry date is required');
        return;
      }

      const expiryDate = new Date(prescriptionForm.expiry_date);
      if (expiryDate <= new Date()) {
        setError('Expiry date must be in the future');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('appointment_id', prescriptionForm.appointment_id);
      formData.append('medications', JSON.stringify(prescriptionForm.medications));
      formData.append('expiry_date', prescriptionForm.expiry_date);
      formData.append('instructions', prescriptionForm.instructions);

      // Append files
      prescriptionForm.files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/api/v1/auth_doctor/psp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create prescription');
      }

      setPrescriptionSuccess(true);
      setTimeout(() => {
        closePrescriptionModal();
        fetchAppointments(); // Refresh the list
      }, 2000);

    } catch (err) {
      console.error('Error creating prescription:', err);
      setError(err instanceof Error ? err.message : 'Failed to create prescription');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error && !showPrescriptionModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Treatment Management</h1>
          <p className="text-xl text-gray-600">Create prescriptions and manage patient treatments</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
              <div className="text-sm text-gray-600">Treatable Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {appointments.filter(apt => apt.status === 'approved' || apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {appointments.filter(apt => apt.appointmentType === 'consultation').length}
              </div>
              <div className="text-sm text-gray-600">Consultations</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients, symptoms, or appointment type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">
              {appointments.length === 0 
                ? "You don't have any treatable appointments yet." 
                : "No appointments match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Patient and Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                          <p className="text-sm text-gray-600 capitalize">{appointment.appointmentType}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium text-gray-900">{formatTime(appointment.appointmentTime)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Symptoms</p>
                          <p className="font-medium text-gray-900 line-clamp-1">{appointment.symptoms}</p>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <span className="font-semibold">Patient Notes:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => openPrescriptionModal(appointment)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Pill className="w-4 h-4" />
                      <span>Create Prescription</span>
                    </button>
                    
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prescription Modal */}
        {showPrescriptionModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Create Prescription for {selectedAppointment.patientName}
                  </h3>
                  <button
                    onClick={closePrescriptionModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  Appointment: {formatDate(selectedAppointment.appointmentDate)} at {formatTime(selectedAppointment.appointmentTime)}
                </p>
              </div>

              <form onSubmit={createPrescription} className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {prescriptionSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-800 font-semibold">
                      ✅ Prescription created successfully! Redirecting...
                    </p>
                  </div>
                )}

                {/* Medications Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-green-600" />
                    Medications
                  </h4>
                  
                  <div className="space-y-4">
                    {prescriptionForm.medications.map((medication, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">Medication #{index + 1}</h5>
                          {prescriptionForm.medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Medication Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={medication.name}
                              onChange={(e) => updateMedication(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Amoxicillin"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dosage *
                            </label>
                            <input
                              type="text"
                              required
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequency *
                            </label>
                            <input
                              type="text"
                              required
                              value={medication.frequency}
                              onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 3 times daily"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration *
                            </label>
                            <input
                              type="text"
                              required
                              value={medication.duration}
                              onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 7 days"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Instructions
                          </label>
                          <textarea
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Additional instructions for this medication..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addMedication}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another Medication</span>
                    </button>
                  </div>
                </div>

                {/* Additional Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General Instructions
                  </label>
                  <textarea
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="General instructions for the patient..."
                  />
                </div>

                {/* Expiry Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={prescriptionForm.expiry_date}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files (Reports, Scans, etc.)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PDF, JPG, PNG up to 10MB
                      </span>
                    </label>
                  </div>
                  
                  {/* Uploaded files list */}
                  {prescriptionForm.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {prescriptionForm.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closePrescriptionModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={prescriptionLoading || prescriptionSuccess}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {prescriptionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Pill className="w-4 h-4" />
                        <span>Create Prescription</span>
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

export default TreatmentManagement;