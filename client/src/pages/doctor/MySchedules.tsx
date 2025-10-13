// components/DoctorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, MapPin } from 'lucide-react';

interface Schedule {
  _id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  isOnLeave: boolean;
}

interface Appointment {
  _id: string;
  user: string;
  patientName: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  status: string;
  createdAt: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Robust time conversion that handles all formats
const formatTimeTo24Hour = (timeString: string): string => {
  if (!timeString) return timeString;
  
  // If already in 24-hour format (HH:MM)
  const twentyFourHourFormat = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (twentyFourHourFormat.test(timeString.trim())) {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  // If in 12-hour format with space (HH:MM AM/PM)
  const twelveHourFormatWithSpace = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i;
  const matchWithSpace = timeString.match(twelveHourFormatWithSpace);
  
  if (matchWithSpace) {
    let hours = parseInt(matchWithSpace[1]);
    const minutes = matchWithSpace[2];
    const period = matchWithSpace[3].toUpperCase();
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // If in 12-hour format without space (HH:MMAM/PM)
  const twelveHourFormatNoSpace = /^(\d{1,2}):(\d{2})(AM|PM|am|pm)$/i;
  const matchNoSpace = timeString.match(twelveHourFormatNoSpace);
  
  if (matchNoSpace) {
    let hours = parseInt(matchNoSpace[1]);
    const minutes = matchNoSpace[2];
    const period = matchNoSpace[3].toUpperCase();
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  console.warn('Unknown time format, returning original:', timeString);
  return timeString;
};

// Convert 24-hour format to 12-hour format for display
const formatTimeTo12Hour = (timeString: string): string => {
  try {
    // First convert to 24-hour format to ensure consistency
    const time24 = formatTimeTo24Hour(timeString);
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error, timeString);
    return timeString;
  }
};

const DoctorDashboard: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch schedules and appointments
  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const token = getCookie('doctor_token');
      
      if (!token) {
        console.error('No token found in cookies');
        return;
      }

      const [schedulesRes, appointmentsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/auth_doctor/all-scd', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/v1/auth_doctor/all-appointments', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!schedulesRes.ok || !appointmentsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const schedulesData = await schedulesRes.json();
      const appointmentsData = await appointmentsRes.json();

      console.log('Schedules response:', schedulesData);
      console.log('Appointments response:', appointmentsData);

      // Handle different response formats
      if (schedulesData.schedules) setSchedules(schedulesData.schedules);
      else if (schedulesData.data) setSchedules(schedulesData.data);
      
      let allAppointments: Appointment[] = [];
      if (appointmentsData.data) allAppointments = appointmentsData.data;
      else if (appointmentsData.appointments) allAppointments = appointmentsData.appointments;

      setAppointments(allAppointments);

      // Filter appointments properly
      const pendingApps = allAppointments.filter((apt: Appointment) => 
        apt.status === 'pending' || !apt.status
      );
      
      const confirmedApps = allAppointments.filter((apt: Appointment) => 
        apt.status === 'confirmed' || apt.status === 'approved'
      );

      console.log('Pending appointments:', pendingApps);
      console.log('Confirmed appointments:', confirmedApps);

      setPendingAppointments(pendingApps);
      setConfirmedAppointments(confirmedApps);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get today's schedule with proper date comparison
  const getTodaySchedule = (): Schedule | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return schedules.find(schedule => {
      const start = new Date(schedule.startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(schedule.endDate);
      end.setHours(23, 59, 59, 999);
      
      return today >= start && today <= end && !schedule.isHoliday && !schedule.isOnLeave;
    }) || null;
  };

  // Generate 15-minute time slots handling mixed formats
  const generateTimeSlots = (startTime: string, endTime: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    try {
      // Convert both times to 24-hour format first
      const startTime24 = formatTimeTo24Hour(startTime);
      const endTime24 = formatTimeTo24Hour(endTime);

      const [startHour, startMinute] = startTime24.split(':').map(Number);
      const [endHour, endMinute] = endTime24.split(':').map(Number);

      let current = new Date();
      current.setHours(startHour, startMinute, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMinute, 0, 0);

      while (current < end) {
        const hours = current.getHours();
        const minutes = current.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        
        slots.push({
          time: timeString,
          available: true
        });

        current.setMinutes(current.getMinutes() + 15);
      }
    } catch (error) {
      console.error('Error generating time slots:', error, startTime, endTime);
    }

    return slots;
  };

  const handleConfirmClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCalendar(true);
    
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    
    const todaySchedule = getTodaySchedule();
    if (todaySchedule) {
      const slots = generateTimeSlots(todaySchedule.startTime, todaySchedule.endTime);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const selectedSchedule = schedules.find(schedule => {
      const scheduleDate = new Date(date);
      scheduleDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(schedule.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(schedule.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      return scheduleDate >= startDate && scheduleDate <= endDate && !schedule.isHoliday && !schedule.isOnLeave;
    });

    if (selectedSchedule) {
      const slots = generateTimeSlots(selectedSchedule.startTime, selectedSchedule.endTime);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
    setSelectedTime('');
  };

  const confirmAppointment = async () => {
    if (!selectedAppointment || !selectedDate || !selectedTime) return;

    try {
      const token = getCookie('doctor_token');
      
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      // Convert selected time back to 24-hour format for backend
      const appointmentTime24 = formatTimeTo24Hour(selectedTime);
      
      // VALIDATION CHECKS
      if (!selectedAppointment._id || selectedAppointment._id.length < 10) {
        alert('Invalid appointment ID');
        return;
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedDate)) {
        alert('Invalid date format. Please select a valid date.');
        return;
      }

      const time24Regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!time24Regex.test(appointmentTime24)) {
        alert('Invalid time format generated. Please try again.');
        return;
      }

      // Create the request payload
      const requestPayload = {
        appointmentId: selectedAppointment._id,
        appointmentDate: selectedDate,
        appointmentTime: appointmentTime24
      };

      console.log('Sending confirmation request:', requestPayload);

      const response = await fetch('http://localhost:8000/api/v1/auth_doctor/confrim-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('Response status:', response.status);
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Backend error response:', errorData);
        
        const errorMessage = errorData.error?.message || errorData.message || `Failed to confirm appointment: ${response.status}`;
        alert(errorMessage);
        return;
      }

      const data = await response.json();
      console.log('Success response data:', data);

      // Update local state - remove from pending and add to confirmed
      setPendingAppointments(prev => prev.filter(apt => apt._id !== selectedAppointment._id));
      
      // Add to confirmed appointments with updated status
      const updatedAppointment = {
        ...selectedAppointment,
        status: 'confirmed',
        appointmentDate: selectedDate,
        appointmentTime: appointmentTime24
      };
      setConfirmedAppointments(prev => [...prev, updatedAppointment]);

      setShowCalendar(false);
      setSelectedAppointment(null);
      setSelectedTime('');
      setSelectedDate('');
      
      alert(data.message || 'Appointment confirmed successfully!');
      
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Network error confirming appointment. Please try again.');
    }
  };

  const todaySchedule = getTodaySchedule();

  // Get today's confirmed appointments count
  const getTodayConfirmedAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return confirmedAppointments.filter(apt => apt.appointmentDate === today).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your schedules and patient appointments</p>
        </div>

        {/* Today's Schedule Card */}
        {todaySchedule && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Working Hours</p>
                  <p className="font-semibold text-gray-900">
                    {formatTimeTo12Hour(todaySchedule.startTime)} - {formatTimeTo12Hour(todaySchedule.endTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending Appointments</p>
                  <p className="font-semibold text-gray-900">{pendingAppointments.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Confirmed Today</p>
                  <p className="font-semibold text-gray-900">{getTodayConfirmedAppointments()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!todaySchedule && schedules.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">No Schedule for Today</h3>
                <p className="text-yellow-700">You don't have a schedule set for today.</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Appointments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pending Appointments</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingAppointments.length} requests
            </span>
          </div>

          {pendingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending appointments</h3>
              <p className="text-gray-500">All appointments have been confirmed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {appointment.patientName}
                      </h3>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mt-1">
                        {appointment.appointmentType}
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Symptoms</p>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {appointment.symptoms}
                      </p>
                    </div>
                    {appointment.notes && (
                      <div>
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-sm text-gray-900">{appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {new Date(appointment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleConfirmClick(appointment)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Modal */}
        {showCalendar && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Appointment for {selectedAppointment.patientName}
                </h3>
                <p className="text-gray-600 mt-1">Select date and time slot</p>
              </div>

              <div className="p-6">
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Slots */}
                {timeSlots.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots (15 min each)
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                          } ${!slot.available && 'opacity-50 cursor-not-allowed'}`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No available slots for selected date
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCalendar(false);
                      setSelectedAppointment(null);
                      setSelectedTime('');
                      setSelectedDate('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAppointment}
                    disabled={!selectedTime}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;