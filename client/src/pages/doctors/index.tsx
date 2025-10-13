import { useState } from "react";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Video, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  CheckCircle2
} from "lucide-react";

const FeaturedDoctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const doctors = [
    {
      id: 1,
      name: "Dr. Michael Rodriguez",
      specialization: "Neurologist",
      experience: "15 years",
      rating: 4.8,
      reviews: 95,
      nextAvailable: "Today, 3:00 PM",
      image: "MR",
      verified: true,
      specialties: ["Epilepsy", "Stroke", "Headache"],
      location: "Los Angeles Medical Center"
    },
    {
      id: 2,
      name: "Dr. Emily Watson",
      specialization: "Orthopedic Surgeon",
      experience: "12 years",
      rating: 4.7,
      reviews: 87,
      nextAvailable: "Tomorrow, 10:30 AM",
      image: "EW",
      verified: true,
      specialties: ["Joint Replacement", "Sports Injury", "Arthroscopy"],
      location: "Chicago Orthopedic Center"
    },
    {
      id: 3,
      name: "Dr. James Kim",
      specialization: "Pediatrician",
      experience: "18 years",
      rating: 4.9,
      reviews: 142,
      nextAvailable: "Today, 1:15 PM",
      image: "JK",
      verified: true,
      specialties: ["Child Development", "Vaccinations", "Nutrition"],
      location: "Boston Children's Hospital"
    },
    {
      id: 4,
      name: "Dr. Lisa Wang",
      specialization: "Dermatologist",
      experience: "10 years",
      rating: 4.6,
      reviews: 78,
      nextAvailable: "Tomorrow, 2:45 PM",
      image: "LW",
      verified: true,
      specialties: ["Acne Treatment", "Skin Cancer", "Cosmetic"],
      location: "Miami Skin Center"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Highly qualified medical professionals dedicated to your health and well-being
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className={`bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 ${
                  index === currentIndex ? "ring-2 ring-blue-500 scale-105" : "hover:shadow-lg"
                }`}
              >
                {/* Doctor Header */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {doctor.image}
                      </div>
                      {doctor.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
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
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{doctor.nextAvailable}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex flex-col items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Video className="w-4 h-4 mb-1" />
                      <span className="text-xs">Video</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Calendar className="w-4 h-4 mb-1" />
                      <span className="text-xs">Book</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4 mb-1" />
                      <span className="text-xs">Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {doctors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedDoctors