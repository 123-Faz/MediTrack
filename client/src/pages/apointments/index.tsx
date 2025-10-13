import { useState } from "react";
import { Heart, Brain, Bone, Baby, Scan, Icon } from "lucide-react";
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  CheckCircle2,
  Star,
  Award,
  Shield,
  ArrowRight,
  Phone,
  Video,
  Users,
  Zap
} from "lucide-react";

const AppointmentBooking = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<"in-person" | "video">("in-person");

  const departments = [
    { id: "cardiology", name: "Cardiology", icon: Heart, color: "text-red-500" },
    { id: "neurology", name: "Neurology", icon: Brain, color: "text-purple-500" },
    { id: "orthopedics", name: "Orthopedics", icon: Bone, color: "text-blue-500" },
    { id: "pediatrics", name: "Pediatrics", icon: Baby, color: "text-pink-500" },
    { id: "dermatology", name: "Dermatology", icon: Scan, color: "text-orange-500" },
    { id: "dentistry", name: "Dentistry", color: "text-cyan-500" }
  ];

  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      specialization: "Cardiologist",
      experience: "12 years",
      rating: 4.9,
      reviews: 128,
      image: "SC",
      nextAvailable: "Tomorrow"
    },
    {
      id: "2",
      name: "Dr. Michael Rodriguez",
      specialization: "Neurologist",
      experience: "15 years",
      rating: 4.8,
      reviews: 95,
      image: "MR",
      nextAvailable: "Today"
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      specialization: "Orthopedic Surgeon",
      experience: "10 years",
      rating: 4.7,
      reviews: 87,
      image: "EW",
      nextAvailable: "Tomorrow"
    }
  ];

  const availableSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Book Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Appointment
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Experience healthcare reimagined. Book appointments with top specialists in just a few clicks. 
              Your journey to better health starts here.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
              {[
                { number: "50K+", label: "Happy Patients" },
                { number: "200+", label: "Expert Doctors" },
                { number: "24/7", label: "Support" },
                { number: "15min", label: "Average Wait" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Process */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Progress Steps */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all ${
                    step === activeStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : step < activeStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  }`}>
                    {step < activeStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 mx-4 ${
                      step < activeStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Step 1: Department Selection */}
            {activeStep === 1 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Choose a Department
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Select the medical department that best matches your needs
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {departments.map((dept) => {
                    const IconComponent = dept.icon;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => {
                          setSelectedDepartment(dept.id);
                          setActiveStep(2);
                        }}
                        className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 flex items-center justify-center ${dept.color}`}>
                          
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {dept.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Doctor Selection */}
            {activeStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Select Your Doctor
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                  Choose from our team of experienced specialists
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => {
                        setSelectedDoctor(doctor.id);
                        setActiveStep(3);
                      }}
                      className="group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {doctor.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {doctor.name}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Experience</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{doctor.experience}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Next Available</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">{doctor.nextAvailable}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(doctor.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            ({doctor.reviews})
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {activeStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Select Date & Time
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                  Choose your preferred appointment slot
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Appointment Type */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appointment Type</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => setAppointmentType("in-person")}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          appointmentType === "in-person"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <Users className={`w-6 h-6 mx-auto mb-2 ${
                          appointmentType === "in-person" ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <div className="font-semibold text-gray-900 dark:text-white">In-Person</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Clinic Visit</div>
                      </button>
                      <button
                        onClick={() => setAppointmentType("video")}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          appointmentType === "video"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <Video className={`w-6 h-6 mx-auto mb-2 ${
                          appointmentType === "video" ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <div className="font-semibold text-gray-900 dark:text-white">Video Call</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Remote Consultation</div>
                      </button>
                    </div>

                    {/* Date Selection */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Date</h3>
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div key={index} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(`2024-01-${day}`)}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDate === `2024-01-${day}`
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Available Time Slots</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot);
                            setActiveStep(4);
                          }}
                          className={`p-3 border-2 rounded-xl text-center transition-all ${
                            selectedTime === slot
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300"
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {activeStep === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Appointment Confirmed!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Your appointment has been successfully scheduled. You'll receive a confirmation email with all the details.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 max-w-md mx-auto mb-8">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Dr. Sarah Chen</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Jan 20, 2024 • 10:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">In-Person Consultation</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Main Medical Center</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-colors font-medium">
                    Add to Calendar
                  </button>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {activeStep < 4 && (
            <div className="flex justify-between items-center p-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Back
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {activeStep} of 3
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Service?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience healthcare that puts you first with our comprehensive appointment system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Instant Booking",
              description: "Book appointments in under 2 minutes with our streamlined process"
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your medical information is protected with bank-level security"
            },
            {
              icon: Award,
              title: "Verified Doctors",
              description: "All our healthcare providers are thoroughly vetted and certified"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default AppointmentBooking;