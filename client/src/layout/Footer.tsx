import { Link } from "react-router-dom";
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Users,
  Heart,
  Shield,
  Clock,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Find Doctors", href: "/doctors" },
    { name: "Book Appointment", href: "/appointments" },
    { name: "Health Packages", href: "/packages" },
    { name: "Emergency Care", href: "/emergency" },
    { name: "Health Articles", href: "/blog" },
  ];

  const services = [
    { name: "Online Consultation", href: "/consultation" },
    { name: "Medical Records", href: "/records" },
    { name: "Prescription Management", href: "/prescriptions" },
    { name: "Lab Test Booking", href: "/lab-tests" },
    { name: "Health Monitoring", href: "/monitoring" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Emergency Helpline",
      value: "+1 (555) 123-HELP",
      subtext: "24/7 Available"
    },
    {
      icon: Mail,
      label: "Email Support",
      value: "support@meditrack.com",
      subtext: "We reply within 2 hours"
    },
    {
      icon: MapPin,
      label: "Head Office",
      value: "123 Healthcare Ave, Medical City",
      subtext: "MC 12345, United States"
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon - Sun: 24/7",
      subtext: "Emergency services always available"
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  const features = [
    { icon: Shield, text: "HIPAA Compliant" },
    { icon: Heart, text: "Patient First" },
    { icon: Clock, text: "24/7 Support" },
    { icon: Users, text: "500+ Doctors" }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          {/* Features Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-200">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="xl:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Stethoscope className="w-8 h-8 text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    MediTrack
                  </h3>
                  <p className="text-sm text-gray-400">Smart Healthcare Management</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Transforming healthcare delivery with cutting-edge technology. 
                Connecting patients with trusted medical professionals for seamless, 
                secure, and efficient healthcare experiences.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-200 mb-3">Stay Updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-blue-600 rounded-lg transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2 group text-sm"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Our Services</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2 group text-sm"
                    >
                      <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group text-sm"
                    >
                      <div className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
              <ul className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600/20 rounded-lg mt-1 flex-shrink-0">
                      <contact.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{contact.label}</p>
                      <p className="text-gray-300 text-sm">{contact.value}</p>
                      <p className="text-gray-400 text-xs">{contact.subtext}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <p>&copy; {currentYear} MediTrack. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Terms
                </Link>
                <Link to="/security" className="hover:text-blue-400 transition-colors">
                  Security
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded-full">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-300 font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full">
                <Heart className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium">Patient First</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <a
          href="tel:+15551234567"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl animate-pulse"
        >
          <Phone className="w-4 h-4" />
          <span className="font-semibold text-sm">EMERGENCY</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;