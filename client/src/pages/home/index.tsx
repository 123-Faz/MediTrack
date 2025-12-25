import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Users, 
  Shield, 
  Clock,
  ArrowRight,
  Star,
  Activity,
  Heart
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      title: "Smart Appointment Booking",
      description: "Book appointments with specialists in just a few clicks. Real-time availability and instant confirmations.",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Digital Health Records",
      description: "Secure, centralized storage for all your medical reports, prescriptions, and health history.",
      icon: FileText,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Multi-Role Platform",
      description: "Seamless experience for patients, doctors, and administrators with role-specific dashboards.",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Doctor Management",
      description: "Comprehensive tools for doctors to manage schedules, patients, and prescriptions efficiently.",
      icon: Stethoscope,
      color: "text-red-600 dark:text-red-400"
    },
    {
      title: "Secure & Private",
      description: "Enterprise-grade security with encrypted data and HIPAA-compliant privacy measures.",
      icon: Shield,
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "24/7 Access",
      description: "Access your medical information anytime, anywhere with our cloud-based platform.",
      icon: Clock,
      color: "text-indigo-600 dark:text-indigo-400"
    }
  ];

  const stats = [
    { number: "10K+", label: "Patients Served" },
    { number: "500+", label: "Expert Doctors" },
    { number: "50K+", label: "Appointments" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  const steps = [
    {
      title: "1. Create Account",
      desc: "Sign up as patient, doctor, or administrator with secure verification.",
    },
    {
      title: "2. Set Up Profile",
      desc: "Complete your profile with essential details and preferences.",
    },
    {
      title: "3. Start Managing",
      desc: "Book appointments, manage schedules, or oversee operations based on your role.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:px-12 lg:px-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                <Activity className="w-4 h-4" />
                Trusted by Medical Professionals
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Modern Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"> Management </span>
                Simplified
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                MediTrack streamlines medical operations with an intelligent platform connecting patients, doctors, and administrators for seamless healthcare delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/about" 
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white dark:border-gray-900" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span>Rated 4.9/5 by healthcare professionals</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {/* Dashboard Preview Cards */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Appointments</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage schedule</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Records</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Health history</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Patients</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Care management</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                    <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Insights & reports</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                <Heart className="w-4 h-4 inline mr-1" />
                Live
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 md:px-12 lg:px-24 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage medical practice efficiently with modern technology and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group"
              >
                <div className={`p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of healthcare providers using MediTrack
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:px-12 lg:px-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Healthcare Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join MediTrack today and experience the future of medical practice management. Free for individual practitioners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 border border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;