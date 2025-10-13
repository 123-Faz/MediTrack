import { 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  Train,
  Wifi,
  Users
} from "lucide-react";

const LocationsSection = () => {
  const locations = [
    {
      city: "New York",
      address: "123 Healthcare Avenue, Manhattan, NY 10001",
      phone: "+1 (555) 123-4567",
      hours: "Mon - Fri: 8:00 AM - 8:00 PM",
      features: ["Emergency Care", "Parking Available", "Metro Access"],
      image: "NY",
      status: "open"
    },
    {
      city: "Los Angeles",
      address: "456 Medical Center Drive, Beverly Hills, CA 90210",
      phone: "+1 (555) 234-5678",
      hours: "Mon - Sun: 7:00 AM - 10:00 PM",
      features: ["24/7 Emergency", "Valet Parking", "Helipad"],
      image: "LA",
      status: "open"
    },
    {
      city: "Chicago",
      address: "789 Health Plaza, Downtown Chicago, IL 60601",
      phone: "+1 (555) 345-6789",
      hours: "Mon - Fri: 7:00 AM - 9:00 PM",
      features: ["Pediatric Center", "Public Transit", "Pharmacy"],
      image: "CH",
      status: "open"
    },
    {
      city: "Miami",
      address: "321 Wellness Boulevard, Miami Beach, FL 33139",
      phone: "+1 (555) 456-7890",
      hours: "Mon - Sat: 8:00 AM - 8:00 PM",
      features: ["Beachside", "Multilingual", "Spa Services"],
      image: "MI",
      status: "closed"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Medical Centers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            State-of-the-art facilities designed for your comfort and care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Location Header */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">
                    {location.image}
                  </div>
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  location.status === "open" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-500 text-white"
                }`}>
                  {location.status === "open" ? "OPEN" : "CLOSED"}
                </div>
              </div>

              {/* Location Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {location.city}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{location.hours}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {location.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Get Directions
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Can't Find Your Location?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We're constantly expanding our network of medical centers. 
              Contact us to learn about upcoming locations in your area.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Request New Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsSection