import { 
  Star, 
  Award, 
  MapPin, 
  MessageCircle,
  Linkedin,
  Twitter
} from "lucide-react";

const LeadershipTeam = () => {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      image: "SC",
      experience: "15+ years",
      specialization: "Cardiology",
      bio: "Board-certified cardiologist with a passion for healthcare innovation and patient-centered care.",
      achievements: ["Harvard Medical School", "Published 50+ Papers", "Medical Innovation Award"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Rodriguez",
      role: "CEO & Founder",
      image: "MR",
      experience: "20+ years",
      specialization: "Healthcare Management",
      bio: "Visionary leader dedicated to transforming healthcare through technology and innovation.",
      achievements: ["Forbes 30 Under 30", "Tech Innovator Award", "Healthcare Pioneer"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Operations",
      image: "EW",
      experience: "12+ years",
      specialization: "Medical Administration",
      bio: "Expert in healthcare operations with a focus on efficiency and patient satisfaction.",
      achievements: ["Operations Excellence", "Patient Safety Award", "Process Innovation"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Dr. James Kim",
      role: "Technology Director",
      image: "JK",
      experience: "10+ years",
      specialization: "Health Tech",
      bio: "Technology innovator bridging the gap between healthcare and cutting-edge solutions.",
      achievements: ["AI in Healthcare", "Tech Patent Holder", "Digital Health Expert"],
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Guided by experienced professionals committed to excellence in healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {member.role}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{member.experience} experience</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>

                {/* Achievements */}
                <div className="space-y-2 mb-4">
                  {member.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href={member.social.linkedin} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a href={member.social.twitter} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadershipTeam 