import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  ArrowRight,
  Send,
  Shield,
  CheckCircle2
} from "lucide-react";

const ContactHero = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      details: "+1 (555) 123-4567",
      action: "Call Now",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us your questions",
      details: "hello@medicare.com",
      action: "Send Email",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Meet us in person",
      details: "123 Healthcare Ave, Medical City",
      action: "Get Directions",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Clock,
      title: "Office Hours",
      description: "When we're available",
      details: "Mon - Fri: 8AM - 8PM EST",
      action: "View Schedule",
      color: "from-orange-500 to-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              We're Here to Help
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Get in
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {" "}Touch
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Have questions about our services? Need to schedule an appointment? 
              Our dedicated team is here to assist you with all your healthcare needs.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15min</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Secure Communication</span>
              </div>
            </div>
          </div>

          {/* Right Content - Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {method.description}
                  </p>
                  
                  <p className="text-gray-900 dark:text-white font-semibold mb-4">
                    {method.details}
                  </p>
                  
                  <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                    {method.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;