import { motion } from "framer-motion";
import {
  Scale,
  Shield,
  Users,
  AlertCircle,
  FileText,
  Lock,
} from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
            By creating an account, accessing, or using any part of the Service,
            you acknowledge that you have read, understood, and agree to be
            bound by these Terms, as well as our Privacy Policy. If you are
            using the Service on behalf of an educational institution or
            organization, you represent that you have the authority to bind that
            entity to these Terms.
          </p>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will
            notify you of material changes by posting the updated Terms on our
            platform or by sending you an email. Your continued use of the
            Service after such changes constitutes your acceptance of the
            modified Terms.
          </p>
        </>
      ),
    },
    {
      id: 2,
      icon: Users,
      title: "2. Eligibility",
      content: (
        <>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
            You must be at least 13 years of age to use the Service. If you are
            under 18 years of age (or the age of majority in your jurisdiction),
            you must have permission from a parent or legal guardian to use the
            Service.
          </p>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            By using the Service, you represent and warrant that you meet these
            eligibility requirements. If you do not meet these requirements, you
            must not access or use the Service.
          </p>
        </>
      ),
    },
    {
      id: 3,
      icon: Lock,
      title: "3. Account Registration and Security",
      subsections: [
        {
          title: "3.1 Account Creation",
          content:
            "To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
        },
        {
          title: "3.2 Account Security",
          content:
            "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
          list: [
            "Keep your password secure and confidential",
            "Notify us immediately of any unauthorized use of your account",
            "Not share your account credentials with any third party",
            "Log out from your account at the end of each session",
          ],
        },
        {
          title: "3.3 Account Termination",
          content:
            "We reserve the right to suspend or terminate your account if we believe you have violated these Terms or engaged in fraudulent, abusive, or illegal activity.",
        },
      ],
    },
    {
      id: 4,
      icon: Shield,
      title: "4. Use of the Service",
      subsections: [
        {
          title: "4.1 License Grant",
          content:
            "Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial educational purposes.",
        },
        {
          title: "4.2 Restrictions",
          content: "You agree not to:",
          list: [
            "Use the Service for any illegal, harmful, or unauthorized purpose",
            "Attempt to gain unauthorized access to any part of the Service or related systems",
            "Reverse engineer, decompile, or disassemble any part of the Service",
            "Copy, modify, distribute, sell, or lease any part of the Service",
            "Interfere with or disrupt the Service or servers or networks connected to the Service",
            "Use automated systems (bots, scrapers, etc.) to access the Service without our permission",
            "Impersonate any person or entity or falsely state or misrepresent your affiliation",
            "Upload, post, or transmit any viruses, malware, or other harmful code",
            "Harass, threaten, or harm other users of the Service",
          ],
        },
        {
          title: "4.3 Educational Purpose",
          content:
            "The Service is designed as an educational support tool to help students identify and prioritize skill gaps. It is not a substitute for professional academic counseling, tutoring, or mental health services. Results and recommendations provided by the Service are for informational purposes only.",
        },
      ],
    },
  ];

  const additionalSections = [
    {
      id: 5,
      title: "5. User Content and Data",
      points: [
        {
          subtitle: "5.1 Your Content",
          text: 'You may provide information, data, and content to the Service, including course information, assessment responses, and progress data ("User Content"). You retain all ownership rights to your User Content.',
        },
        {
          subtitle: "5.2 License to Use Your Content",
          text: "By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, process, and analyze your User Content solely for the purpose of providing and improving the Service. This license includes the right to use anonymized and aggregated data for research and development purposes.",
        },
        {
          subtitle: "5.3 Your Responsibilities",
          text: "You represent and warrant that:",
          list: [
            "You own or have the necessary rights to submit your User Content",
            "Your User Content does not violate any third-party rights or applicable laws",
            "Your User Content is accurate and not misleading",
          ],
        },
      ],
    },
    {
      id: 6,
      title: "6. Intellectual Property Rights",
      points: [
        {
          subtitle: "6.1 Our Ownership",
          text: "The Service, including all content, features, functionality, software, algorithms, and design, is owned by Kryva and is protected by copyright, trademark, patent, trade secret, and other intellectual property laws.",
        },
        {
          subtitle: "6.2 Trademarks",
          text: '"Kryva" and related logos, product names, and service names are trademarks of Kryva. You may not use these marks without our prior written permission.',
        },
        {
          subtitle: "6.3 Feedback",
          text: "If you provide us with any feedback, suggestions, or ideas about the Service, you grant us the right to use such feedback without any obligation to you.",
        },
      ],
    },
    {
      id: 7,
      title: "7. Privacy and Data Protection",
      points: [
        {
          text: "Your privacy is important to us. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our data practices as described in the Privacy Policy.",
        },
        {
          text: "We implement appropriate technical and organizational measures to protect your data. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
        },
      ],
    },
    {
      id: 8,
      title: "8. Third-Party Services and Links",
      points: [
        {
          text: "The Service may contain links to third-party websites, services, or resources that are not owned or controlled by Kryva. We are not responsible for the content, privacy policies, or practices of any third-party websites or services.",
        },
        {
          text: "Your use of third-party services is at your own risk, and you should review their terms and privacy policies before using them.",
        },
      ],
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
            <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Terms of Service
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
              Welcome to Kryva ("we," "us," or "our"). These Terms of Service
              ("Terms") govern your access to and use of Kryva's
              consequence-aware skill gap self-diagnosis system, including our
              website, platform, and related services (collectively, the
              "Service").
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              By accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree to these Terms, you may not access or
              use the Service.
            </p>
          </motion.div>

          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white pt-1">
                    {section.title}
                  </h2>
                </div>

                {section.content && (
                  <div className="ml-0 sm:ml-14">{section.content}</div>
                )}

                {section.subsections && (
                  <div className="ml-0 sm:ml-14 space-y-4 sm:space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <motion.div
                        key={subIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.4 + index * 0.1 + subIndex * 0.05,
                        }}
                        className="space-y-3"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {subsection.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          {subsection.content}
                        </p>
                        {subsection.list && (
                          <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm sm:text-base text-gray-300">
                            {subsection.list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>
            );
          })}

          {additionalSections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {section.title}
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {section.points.map((point, pIndex) => (
                  <div key={pIndex} className="space-y-2">
                    {"subtitle" in point && (
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {point.subtitle}
                      </h3>
                    )}
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {point.text}
                    </p>
                    {"list" in point && point.list && (
                      <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm sm:text-base text-gray-300">
                        {point.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          ))}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              9. Disclaimers and Limitations of Liability
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  9.1 No Warranties
                </h3>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
                    BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR
                    COURSE OF PERFORMANCE.
                  </p>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    We do not warrant that the Service will be uninterrupted,
                    secure, or error-free, that defects will be corrected, or
                    that the Service or servers are free of viruses or other
                    harmful components.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  9.2 Educational Tool Disclaimer
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">
                  Kryva is an educational support tool designed to help students
                  identify skill gaps and make informed decisions about their
                  learning priorities. The assessments, recommendations, and
                  action plans provided by the Service are based on automated
                  analysis and should not be considered as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm sm:text-base text-gray-300">
                  <li>Professional academic counseling or advising</li>
                  <li>
                    Psychological or mental health assessment or treatment
                  </li>
                  <li>A guarantee of academic success or specific outcomes</li>
                  <li>
                    A replacement for institutional academic support services
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  9.3 Limitation of Liability
                </h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, KRYVA SHALL NOT BE
                    LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                    OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
                    WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF
                    DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING
                    FROM YOUR USE OF THE SERVICE. IN NO EVENT SHALL OUR TOTAL
                    LIABILITY EXCEED $100 OR THE AMOUNT YOU PAID US IN THE
                    TWELVE MONTHS PRIOR TO THE EVENT GIVING RISE TO THE
                    LIABILITY, WHICHEVER IS GREATER.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              14. Contact Information
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 sm:p-6 text-sm sm:text-base text-gray-300 space-y-2">
              <p>
                <strong className="text-white">Kryva</strong>
              </p>
              <p>Email: support@kryva.com</p>
              <p>Legal: legal@kryva.com</p>
              <p>GitHub: https://github.com/MohdAqdasAsim/Kryva</p>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 sm:p-6"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Acknowledgment
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  By using the Service, you acknowledge that you have read these
                  Terms of Service and agree to be bound by them. If you do not
                  agree to these Terms, you must not use the Service.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            className="text-center text-gray-500 text-xs sm:text-sm pt-6 sm:pt-8 border-t border-white/10 space-y-1"
          >
            <p>© 2026 Kryva. All rights reserved.</p>
            <p>Version 0.1.0</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
