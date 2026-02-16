import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
  AlertTriangle,
} from "lucide-react";

const PrivacyPolicy = () => {
  const dataCollectionSections = [
    {
      icon: UserCheck,
      title: "Account Information",
      items: [
        "Name and email address",
        "Username and password",
        "Profile information (optional profile picture, bio)",
        "Educational institution and enrollment details",
      ],
    },
    {
      icon: Database,
      title: "Academic Information",
      items: [
        "Course enrollment and academic program details",
        "Semester and year of study",
        "Course syllabi and timelines (when provided)",
        "Academic goals and priorities",
      ],
    },
    {
      icon: Eye,
      title: "Assessment Data",
      items: [
        "Responses to skill assessments and diagnostic tests",
        "Self-reported proficiency levels and skill gaps",
        "Learning preferences and study patterns",
        "Progress tracking data",
      ],
    },
  ];

  const usageReasons = [
    {
      title: "To Provide and Maintain the Service",
      color: "blue",
      items: [
        "Create and manage your account",
        "Deliver personalized skill assessments and analyses",
        "Generate consequence-weighted gap prioritization",
        "Provide tailored action plans and recommendations",
        "Track your progress and provide reassessments",
      ],
    },
    {
      title: "To Improve and Optimize the Service",
      color: "green",
      items: [
        "Analyze usage patterns and trends",
        "Develop new features and functionality",
        "Improve our algorithms and recommendation engine",
        "Conduct research and data analysis (using anonymized data)",
      ],
    },
    {
      title: "For Security and Compliance",
      color: "red",
      items: [
        "Detect, prevent, and address fraud and security issues",
        "Enforce our Terms of Service",
        "Comply with legal obligations and regulations",
        "Protect the rights, property, and safety of Kryva and our users",
      ],
    },
  ];

  const yourRights = [
    {
      icon: Eye,
      title: "Access and Portability",
      description:
        "You have the right to access and receive a copy of your personal information. You can download your data through your account settings or by contacting us.",
    },
    {
      icon: Lock,
      title: "Correction and Update",
      description:
        "You can update your account information and profile details at any time through your account settings. If you need assistance, please contact us.",
    },
    {
      icon: AlertTriangle,
      title: "Deletion",
      description:
        "You have the right to request deletion of your personal information. You can delete your account through your account settings or by contacting us at privacy@kryva.com.",
    },
  ];

  return (
    <div className="flex-1 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Privacy Policy
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base text-gray-400">
            <p>
              <strong>Effective Date:</strong> February 13, 2026
            </p>
            <span className="hidden sm:inline">•</span>
            <p>
              <strong>Last Updated:</strong> February 13, 2026
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              At Kryva, we are committed to protecting your privacy and ensuring
              the security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our consequence-aware skill gap
              self-diagnosis system and related services (collectively, the
              "Service").
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 sm:p-5">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                <strong className="text-white">Your Privacy Matters:</strong> We
                are committed to transparency in our data practices. This policy
                outlines what data we collect, why we collect it, how we use it,
                and your rights regarding your personal information.
              </p>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              1. Information We Collect
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                  1.1 Information You Provide to Us
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4">
                  We collect information that you voluntarily provide when you
                  use the Service:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dataCollectionSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <h4 className="font-semibold text-white text-sm sm:text-base">
                            {section.title}
                          </h4>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                  1.2 Information Collected Automatically
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-3">
                  When you access or use the Service, we automatically collect
                  certain information:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2 text-sm sm:text-base text-gray-300">
                  <p>
                    • IP address and geographic location (city/region level)
                  </p>
                  <p>• Device type, operating system, and browser type</p>
                  <p>
                    • Pages visited, features used, and time spent on the
                    Service
                  </p>
                  <p>• Session duration and frequency of use</p>
                  <p>• Error logs and diagnostic information</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                  1.3 Cookies and Tracking Technologies
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-3">
                  We use cookies and similar tracking technologies to collect
                  and track information:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      type: "Essential Cookies",
                      desc: "Required for the Service to function properly",
                    },
                    {
                      type: "Functional Cookies",
                      desc: "Remember your preferences and settings",
                    },
                    {
                      type: "Analytics Cookies",
                      desc: "Help us understand how you use the Service",
                    },
                    {
                      type: "Performance Cookies",
                      desc: "Improve Service performance and user experience",
                    },
                  ].map((cookie, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                      className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3"
                    >
                      <p className="font-semibold text-purple-300 text-sm mb-1">
                        {cookie.type}
                      </p>
                      <p className="text-xs text-gray-400">{cookie.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              2. How We Use Your Information
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              We use the information we collect for the following purposes:
            </p>

            <div className="space-y-4">
              {usageReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`bg-${reason.color}-500/10 border border-${reason.color}-500/20 rounded-lg p-4 sm:p-5`}
                >
                  <h3
                    className={`text-lg sm:text-xl font-semibold text-${reason.color}-300 mb-3`}
                  >
                    {reason.title}
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                    {reason.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`text-${reason.color}-400 mt-1`}>
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              3. How We Share Your Information
            </h2>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 sm:p-5">
              <p className="text-base sm:text-lg font-semibold text-green-300 mb-2">
                We do not sell your personal information.
              </p>
              <p className="text-sm sm:text-base text-gray-300">
                We may share your information only in the following limited
                circumstances:
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  title: "3.1 Service Providers",
                  content:
                    "We may share your information with third-party service providers who perform services on our behalf, such as cloud hosting (Firebase), analytics, and customer support. These providers are contractually obligated to protect your information.",
                },
                {
                  title: "3.2 Educational Institutions",
                  content:
                    "If you access the Service through an institutional partnership, we may share aggregated, anonymized data with your institution for research purposes. We will not share your individual identifiable information without your explicit consent.",
                },
                {
                  title: "3.3 Legal Requirements",
                  content:
                    "We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas, or government requests).",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="border-l-4 border-blue-500 bg-white/5 pl-4 sm:pl-5 pr-4 py-3 rounded-r-lg"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                4. Data Security
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-300">
              We implement appropriate technical and organizational security
              measures to protect your information:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Encryption of data in transit (HTTPS/TLS) and at rest",
                "Regular security audits and vulnerability assessments",
                "Access controls and authentication mechanisms",
                "Secure cloud infrastructure (Firebase Security Rules)",
                "Employee training on data protection practices",
                "Incident response and breach notification procedures",
              ].map((measure, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4"
                >
                  <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-300">{measure}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              6. Your Rights and Choices
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              You have certain rights regarding your personal information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {yourRights.map((right, index) => {
                const Icon = right.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-5 space-y-3"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {right.title}
                    </h3>
                    <p className="text-sm text-gray-300">{right.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                International Privacy Rights
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5 space-y-3"
              >
                <h3 className="text-xl font-semibold text-white">
                  GDPR (European Users)
                </h3>
                <p className="text-sm text-gray-300">
                  If you are located in the EEA, you have additional rights
                  including:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[
                    "Right of access to your personal data",
                    "Right to rectification of inaccurate data",
                    "Right to erasure ('right to be forgotten')",
                    "Right to data portability",
                    "Right to object to processing",
                  ].map((right, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">✓</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-5 space-y-3"
              >
                <h3 className="text-xl font-semibold text-white">
                  CCPA (California Users)
                </h3>
                <p className="text-sm text-gray-300">
                  If you are a California resident, you have rights including:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[
                    "Right to know what personal information we collect",
                    "Right to request deletion of your information",
                    "Right to opt-out of sale (we do not sell data)",
                    "Right to non-discrimination for exercising rights",
                  ].map((right, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              13. Contact Us
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-5 sm:p-6 text-sm sm:text-base text-gray-300 space-y-2">
              <p>
                <strong className="text-white">Kryva Privacy Team</strong>
              </p>
              <p>Email: privacy@kryva.com</p>
              <p>Data Protection Officer: dpo@kryva.com</p>
              <p>General Support: support@kryva.com</p>
              <p>GitHub: https://github.com/MohdAqdasAsim/Kryva</p>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-xl p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Privacy Policy Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "What we collect",
                  value:
                    "Account info, academic data, assessments, usage analytics",
                },
                {
                  label: "Why we collect it",
                  value: "Personalized skill gap analysis and action plans",
                },
                {
                  label: "How we protect it",
                  value: "Encryption, secure infrastructure, access controls",
                },
                {
                  label: "Your rights",
                  value: "Access, correct, delete your data anytime",
                },
                {
                  label: "We do not",
                  value: "Sell your personal information to third parties",
                },
                {
                  label: "Data retention",
                  value:
                    "Active account + reasonable period or 90 days after deletion",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <p className="font-semibold text-white text-sm mb-1">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="text-center text-gray-500 text-xs sm:text-sm pt-6 sm:pt-8 border-t border-white/10 space-y-1"
          >
            <p>© 2026 Kryva. All rights reserved.</p>
            <p>Version 0.1.0</p>
            <p>This Privacy Policy is effective as of February 13, 2026</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
