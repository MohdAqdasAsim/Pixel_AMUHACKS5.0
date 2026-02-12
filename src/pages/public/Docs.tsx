import { useState } from "react";
import {
  Book,
  Code,
  Rocket,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: Rocket },
    { id: "user-guide", title: "User Guide", icon: Book },
    { id: "api", title: "API Reference", icon: Code },
    { id: "configuration", title: "Configuration", icon: Settings },
    { id: "faq", title: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-bold text-white">Documentation</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about using Kryva effectively
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </aside>

          {/* Content Area */}
          <main className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-8">
            {activeSection === "getting-started" && <GettingStarted />}
            {activeSection === "user-guide" && <UserGuide />}
            {activeSection === "api" && <APIReference />}
            {activeSection === "configuration" && <Configuration />}
            {activeSection === "faq" && <FAQ />}
          </main>
        </div>
      </div>
    </div>
  );
};

const GettingStarted = () => (
  <div className="space-y-8 text-gray-300">
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">
        Getting Started with Kryva
      </h2>
      <p className="text-lg">
        Welcome to Kryva! This guide will help you get up and running in
        minutes.
      </p>
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Step 1: Create Your Account
        </h3>
        <p className="mb-2">
          Sign up using your university email address to get started. You'll
          receive a verification email to confirm your account.
        </p>
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300">
          <strong>Tip:</strong> Use your institutional email for automatic
          course integration where available.
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Step 2: Complete Onboarding
        </h3>
        <p className="mb-2">During onboarding, you'll provide:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Your current courses and subjects</li>
          <li>Academic timeline and important deadlines</li>
          <li>Learning preferences and goals</li>
          <li>Previous academic background</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Step 3: Take Your First Assessment
        </h3>
        <p className="mb-2">
          Kryva's adaptive assessment will evaluate your current skill levels
          across different domains. The assessment:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Takes approximately 30-45 minutes</li>
          <li>Adapts based on your responses</li>
          <li>Can be paused and resumed anytime</li>
          <li>Provides immediate insights upon completion</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Step 4: Review Your Action Plan
        </h3>
        <p>
          After assessment, you'll receive a personalized action plan that
          prioritizes your skill gaps based on academic consequence and urgency.
          Follow the recommendations to maximize your academic success.
        </p>
      </div>
    </div>
  </div>
);

const UserGuide = () => (
  <div className="space-y-8 text-gray-300">
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">User Guide</h2>
      <p className="text-lg">
        Comprehensive guide to using Kryva's features effectively.
      </p>
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Dashboard Overview
        </h3>
        <p>Your dashboard provides a at-a-glance view of:</p>
        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
          <li>Current priority skill gaps</li>
          <li>Progress on action items</li>
          <li>Upcoming assessment deadlines</li>
          <li>Recent achievements and improvements</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Understanding Skill Gaps
        </h3>
        <p className="mb-2">
          Kryva categorizes skill gaps into three priority levels:
        </p>
        <div className="space-y-3 mt-3">
          <div className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded">
            <strong className="text-red-400">Critical:</strong> Immediate
            attention required - these gaps pose irreversible risks
          </div>
          <div className="p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
            <strong className="text-yellow-400">High:</strong> Important gaps
            that will impact multiple courses
          </div>
          <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded">
            <strong className="text-green-400">Medium:</strong> Foundational
            skills that should be addressed when time allows
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">Action Plans</h3>
        <p>Each action plan includes:</p>
        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
          <li>Step-by-step learning objectives</li>
          <li>Recommended resources and materials</li>
          <li>Practice exercises and assessments</li>
          <li>Time estimates for completion</li>
          <li>Progress tracking checkpoints</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">Reassessment</h3>
        <p>
          Regular reassessment helps track your progress. We recommend
          reassessing:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
          <li>After completing an action plan</li>
          <li>Every 2-3 weeks for continuous monitoring</li>
          <li>Before major exams or deadlines</li>
          <li>When you feel you've made significant progress</li>
        </ul>
      </div>
    </div>
  </div>
);

const APIReference = () => (
  <div className="space-y-8 text-gray-300">
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">API Reference</h2>
      <p className="text-lg">
        Documentation for developers integrating with Kryva's API.
      </p>
    </div>

    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 mb-6">
      <strong>Note:</strong> API access is currently in beta. Contact us for
      access credentials.
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Authentication
        </h3>
        <p className="mb-3">
          All API requests require authentication using Bearer tokens:
        </p>
        <div className="bg-black/50 p-4 rounded-lg overflow-x-auto">
          <code className="text-green-400">
            Authorization: Bearer YOUR_API_TOKEN
          </code>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">Endpoints</h3>

        <div className="space-y-4">
          <div className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                GET
              </span>
              <code className="text-blue-400">/api/v1/assessments</code>
            </div>
            <p className="text-sm">
              Retrieve all assessments for the authenticated user.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">
                POST
              </span>
              <code className="text-blue-400">/api/v1/assessments</code>
            </div>
            <p className="text-sm">
              Create a new assessment for the authenticated user.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                GET
              </span>
              <code className="text-blue-400">/api/v1/skill-gaps</code>
            </div>
            <p className="text-sm">
              Get prioritized skill gaps with consequence analysis.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                GET
              </span>
              <code className="text-blue-400">/api/v1/action-plans</code>
            </div>
            <p className="text-sm">Retrieve personalized action plans.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">Rate Limits</h3>
        <p>
          API requests are limited to 1000 requests per hour per API key. Rate
          limit information is included in response headers.
        </p>
      </div>
    </div>
  </div>
);

const Configuration = () => (
  <div className="space-y-8 text-gray-300">
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">Configuration</h2>
      <p className="text-lg">
        Customize Kryva to match your learning preferences and institutional
        requirements.
      </p>
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Account Settings
        </h3>
        <p className="mb-2">Manage your personal preferences:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Notification preferences (email, in-app)</li>
          <li>Assessment frequency recommendations</li>
          <li>Time zone and schedule preferences</li>
          <li>Privacy and data sharing settings</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Course Configuration
        </h3>
        <p className="mb-2">Configure course-specific settings:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Add or remove courses</li>
          <li>Set course priorities and weights</li>
          <li>Define custom deadlines and milestones</li>
          <li>Configure prerequisite relationships</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-3">
          Assessment Preferences
        </h3>
        <p className="mb-2">Customize your assessment experience:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Question difficulty preferences</li>
          <li>Time limits per assessment</li>
          <li>Feedback detail level</li>
          <li>Reassessment interval recommendations</li>
        </ul>
      </div>
    </div>
  </div>
);

const FAQ = () => (
  <div className="space-y-8 text-gray-300">
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-lg">Common questions about Kryva and how it works.</p>
    </div>

    <div className="space-y-6">
      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          How is Kryva different from other learning platforms?
        </h3>
        <p>
          Kryva focuses on consequence-aware prioritization. Instead of just
          identifying what you don't know, it tells you which gaps to fix first
          based on their potential academic impact. It's designed specifically
          for the critical first-semester period when poor decisions can have
          cascading effects.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          How long does an assessment take?
        </h3>
        <p>
          Initial assessments typically take 30-45 minutes. However, they're
          adaptive and can be paused and resumed. Follow-up reassessments are
          usually shorter (15-20 minutes) as they focus on previously identified
          gap areas.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Is my data secure and private?
        </h3>
        <p>
          Yes. We use Firebase for secure data storage with encryption at rest
          and in transit. Your academic data is never shared with third parties
          without your explicit consent. See our Privacy Policy for complete
          details.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Can I use Kryva for courses beyond my first semester?
        </h3>
        <p>
          While Kryva is optimized for first-semester students, it's effective
          throughout your academic journey. The consequence-aware approach
          becomes especially valuable during foundational courses that have many
          prerequisites.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          What if I disagree with the priority assessment?
        </h3>
        <p>
          You can adjust priorities manually in your dashboard. However, we
          recommend reviewing the consequence analysis first - Kryva's
          recommendations are based on course dependencies, timeline
          constraints, and academic impact data.
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Does Kryva replace my academic advisor?
        </h3>
        <p>
          No. Kryva complements academic advising by providing data-driven
          insights about your skill gaps and learning priorities. We recommend
          discussing your Kryva reports with your advisor to create a
          comprehensive academic strategy.
        </p>
      </div>
    </div>
  </div>
);

export default Docs;
