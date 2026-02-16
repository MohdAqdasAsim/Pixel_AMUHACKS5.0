import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Code,
  Rocket,
  Settings,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: Rocket },
    { id: "user-guide", title: "User Guide", icon: Book },
    { id: "api", title: "API Reference", icon: Code },
    { id: "configuration", title: "Configuration", icon: Settings },
    { id: "faq", title: "FAQ", icon: HelpCircle },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex-1 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Documentation
          </h1>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Everything you need to know about using Kryva effectively
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>

          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:block lg:w-64 space-y-2"
          >
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{section.title}</span>
                  {activeSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.aside>

          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-white/10 z-50 p-6 space-y-2 overflow-y-auto"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Navigation</h2>
                  </div>
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          activeSection === section.id
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{section.title}</span>
                        {activeSection === section.id && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === "getting-started" && <GettingStarted />}
                {activeSection === "user-guide" && <UserGuide />}
                {activeSection === "api" && <APIReference />}
                {activeSection === "configuration" && <Configuration />}
                {activeSection === "faq" && <FAQ />}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

const GettingStarted = () => (
  <div className="space-y-6 sm:space-y-8 text-gray-300">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        Getting Started with Kryva
      </h2>
      <p className="text-base sm:text-lg">
        Welcome to Kryva! This guide will help you get up and running in
        minutes.
      </p>
    </motion.div>

    <div className="space-y-6">
      {[
        {
          title: "Step 1: Create Your Account",
          content: (
            <>
              <p className="mb-2">
                Sign up using your university email address to get started.
                You'll receive a verification email to confirm your account.
              </p>
              <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-sm sm:text-base">
                <strong>Tip:</strong> Use your institutional email for automatic
                course integration where available.
              </div>
            </>
          ),
        },
        {
          title: "Step 2: Complete Onboarding",
          content: (
            <>
              <p className="mb-2">During onboarding, you'll provide:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                <li>Your current courses and subjects</li>
                <li>Academic timeline and important deadlines</li>
                <li>Learning preferences and goals</li>
                <li>Previous academic background</li>
              </ul>
            </>
          ),
        },
        {
          title: "Step 3: Take Your First Assessment",
          content: (
            <>
              <p className="mb-2">
                Kryva's adaptive assessment will evaluate your current skill
                levels across different domains. The assessment:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                <li>Takes approximately 30-45 minutes</li>
                <li>Adapts based on your responses</li>
                <li>Can be paused and resumed anytime</li>
                <li>Provides immediate insights upon completion</li>
              </ul>
            </>
          ),
        },
        {
          title: "Step 4: Review Your Action Plan",
          content: (
            <p className="text-sm sm:text-base">
              After assessment, you'll receive a personalized action plan that
              prioritizes your skill gaps based on academic consequence and
              urgency. Follow the recommendations to maximize your academic
              success.
            </p>
          ),
        },
      ].map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
            {step.title}
          </h3>
          {step.content}
        </motion.div>
      ))}
    </div>
  </div>
);

const UserGuide = () => (
  <div className="space-y-6 sm:space-y-8 text-gray-300">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        User Guide
      </h2>
      <p className="text-base sm:text-lg">
        Comprehensive guide to using Kryva's features effectively.
      </p>
    </motion.div>

    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Dashboard Overview
        </h3>
        <p className="text-sm sm:text-base">
          Your dashboard provides a at-a-glance view of:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 mt-2 text-sm sm:text-base">
          <li>Current priority skill gaps</li>
          <li>Progress on action items</li>
          <li>Upcoming assessment deadlines</li>
          <li>Recent achievements and improvements</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Understanding Skill Gaps
        </h3>
        <p className="mb-2 text-sm sm:text-base">
          Kryva categorizes skill gaps into three priority levels:
        </p>
        <div className="space-y-3 mt-3">
          {[
            {
              bg: "bg-red-500/10",
              border: "border-red-500",
              text: "text-red-400",
              label: "Critical:",
              desc: "Immediate attention required - these gaps pose irreversible risks",
            },
            {
              bg: "bg-yellow-500/10",
              border: "border-yellow-500",
              text: "text-yellow-400",
              label: "High:",
              desc: "Important gaps that will impact multiple courses",
            },
            {
              bg: "bg-green-500/10",
              border: "border-green-500",
              text: "text-green-400",
              label: "Medium:",
              desc: "Foundational skills that should be addressed when time allows",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-3 ${item.bg} border-l-4 ${item.border} rounded text-sm sm:text-base`}
            >
              <strong className={item.text}>{item.label}</strong> {item.desc}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Action Plans
        </h3>
        <p className="text-sm sm:text-base">Each action plan includes:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 mt-2 text-sm sm:text-base">
          <li>Step-by-step learning objectives</li>
          <li>Recommended resources and materials</li>
          <li>Practice exercises and assessments</li>
          <li>Time estimates for completion</li>
          <li>Progress tracking checkpoints</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Reassessment
        </h3>
        <p className="text-sm sm:text-base">
          Regular reassessment helps track your progress. We recommend
          reassessing:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 mt-2 text-sm sm:text-base">
          <li>After completing an action plan</li>
          <li>Every 2-3 weeks for continuous monitoring</li>
          <li>Before major exams or deadlines</li>
          <li>When you feel you've made significant progress</li>
        </ul>
      </motion.div>
    </div>
  </div>
);

const APIReference = () => (
  <div className="space-y-6 sm:space-y-8 text-gray-300">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        API Reference
      </h2>
      <p className="text-base sm:text-lg">
        Documentation for developers integrating with Kryva's API.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 mb-6 text-sm sm:text-base"
    >
      <strong>Note:</strong> API access is currently in beta. Contact us for
      access credentials.
    </motion.div>

    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Authentication
        </h3>
        <p className="mb-3 text-sm sm:text-base">
          All API requests require authentication using Bearer tokens:
        </p>
        <div className="bg-black/50 p-3 sm:p-4 rounded-lg overflow-x-auto">
          <code className="text-green-400 text-xs sm:text-sm">
            Authorization: Bearer YOUR_API_TOKEN
          </code>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Endpoints
        </h3>

        <div className="space-y-4">
          {[
            {
              method: "GET",
              color: "green",
              endpoint: "/api/v1/assessments",
              desc: "Retrieve all assessments for the authenticated user.",
            },
            {
              method: "POST",
              color: "blue",
              endpoint: "/api/v1/assessments",
              desc: "Create a new assessment for the authenticated user.",
            },
            {
              method: "GET",
              color: "green",
              endpoint: "/api/v1/skill-gaps",
              desc: "Get prioritized skill gaps with consequence analysis.",
            },
            {
              method: "GET",
              color: "green",
              endpoint: "/api/v1/action-plans",
              desc: "Retrieve personalized action plans.",
            },
          ].map((api, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="border border-white/10 rounded-lg p-3 sm:p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 bg-${api.color}-500/20 text-${api.color}-400 text-xs font-bold rounded`}
                >
                  {api.method}
                </span>
                <code className="text-blue-400 text-xs sm:text-sm break-all">
                  {api.endpoint}
                </code>
              </div>
              <p className="text-xs sm:text-sm">{api.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
          Rate Limits
        </h3>
        <p className="text-sm sm:text-base">
          API requests are limited to 1000 requests per hour per API key. Rate
          limit information is included in response headers.
        </p>
      </motion.div>
    </div>
  </div>
);

const Configuration = () => (
  <div className="space-y-6 sm:space-y-8 text-gray-300">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        Configuration
      </h2>
      <p className="text-base sm:text-lg">
        Customize Kryva to match your learning preferences and institutional
        requirements.
      </p>
    </motion.div>

    <div className="space-y-6">
      {[
        {
          title: "Account Settings",
          desc: "Manage your personal preferences:",
          items: [
            "Notification preferences (email, in-app)",
            "Assessment frequency recommendations",
            "Time zone and schedule preferences",
            "Privacy and data sharing settings",
          ],
        },
        {
          title: "Course Configuration",
          desc: "Configure course-specific settings:",
          items: [
            "Add or remove courses",
            "Set course priorities and weights",
            "Define custom deadlines and milestones",
            "Configure prerequisite relationships",
          ],
        },
        {
          title: "Assessment Preferences",
          desc: "Customize your assessment experience:",
          items: [
            "Question difficulty preferences",
            "Time limits per assessment",
            "Feedback detail level",
            "Reassessment interval recommendations",
          ],
        },
      ].map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
            {section.title}
          </h3>
          <p className="mb-2 text-sm sm:text-base">{section.desc}</p>
          <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </div>
);

const FAQ = () => (
  <div className="space-y-6 sm:space-y-8 text-gray-300">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-base sm:text-lg">
        Common questions about Kryva and how it works.
      </p>
    </motion.div>

    <div className="space-y-4 sm:space-y-6">
      {[
        {
          q: "How is Kryva different from other learning platforms?",
          a: "Kryva focuses on consequence-aware prioritization. Instead of just identifying what you don't know, it tells you which gaps to fix first based on their potential academic impact. It's designed specifically for the critical first-semester period when poor decisions can have cascading effects.",
        },
        {
          q: "How long does an assessment take?",
          a: "Initial assessments typically take 30-45 minutes. However, they're adaptive and can be paused and resumed. Follow-up reassessments are usually shorter (15-20 minutes) as they focus on previously identified gap areas.",
        },
        {
          q: "Is my data secure and private?",
          a: "Yes. We use Firebase for secure data storage with encryption at rest and in transit. Your academic data is never shared with third parties without your explicit consent. See our Privacy Policy for complete details.",
        },
        {
          q: "Can I use Kryva for courses beyond my first semester?",
          a: "While Kryva is optimized for first-semester students, it's effective throughout your academic journey. The consequence-aware approach becomes especially valuable during foundational courses that have many prerequisites.",
        },
        {
          q: "What if I disagree with the priority assessment?",
          a: "You can adjust priorities manually in your dashboard. However, we recommend reviewing the consequence analysis first - Kryva's recommendations are based on course dependencies, timeline constraints, and academic impact data.",
        },
        {
          q: "Does Kryva replace my academic advisor?",
          a: "No. Kryva complements academic advising by providing data-driven insights about your skill gaps and learning priorities. We recommend discussing your Kryva reports with your advisor to create a comprehensive academic strategy.",
        },
      ].map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
          whileHover={{ scale: 1.01 }}
          className="border border-white/10 rounded-lg p-4 sm:p-6 hover:border-white/20 transition-colors"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            {faq.q}
          </h3>
          <p className="text-sm sm:text-base">{faq.a}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Docs;
