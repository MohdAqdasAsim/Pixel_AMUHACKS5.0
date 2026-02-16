import { Link, useLocation } from "react-router-dom";
import {
  HelpCircle,
  User,
  Settings,
  LogOut,
  Shield,
  FileText,
  ChevronRight,
  Home,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/config";
import { motion, AnimatePresence } from "framer-motion";

const Breadcrumb = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageError, setImageError] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
        setSignOutError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setImageError(false);
  }, [user?.photoURL]);

  const handleSignOut = async () => {
    setSignOutError("");
    try {
      await signOut(auth);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes("network")) {
          setSignOutError("Network error. Please check your connection.");
        } else if (errorMessage.includes("auth")) {
          setSignOutError("Authentication error. Please try again.");
        } else {
          setSignOutError("Unable to sign out. Please try again.");
        }
      } else {
        setSignOutError("An unexpected error occurred.");
      }
      console.error("Error signing out:", error);
    }
  };

  const getPathSegments = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    const pathMap: Record<string, string> = {
      dashboard: "Dashboard",
      assessments: "Assessments",
      "skill-gaps": "Skill Gaps",
      "action-plans": "Action Plans",
      "account-preferences": "Account Preferences",
      "privacy-policy": "Privacy Policy",
      "terms-of-service": "Terms of Service",
      docs: "Help & Support",
    };

    return segments.map((segment, index) => ({
      name:
        pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + segments.slice(0, index + 1).join("/"),
      isLast: index === segments.length - 1,
    }));
  };

  const breadcrumbs = getPathSegments();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user display name (from Google or email)
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    return user?.email?.split("@")[0] || "Student";
  };

  // Check if user has a profile photo (from Google sign-in)
  const userPhotoURL = user?.photoURL;
  const hasProfilePhoto = userPhotoURL && !imageError;

  return (
    <div className="border-b border-gray-800/50 px-4 sm:px-6 py-3 bg-[#0E131C]">
      <div className="flex items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.svg" alt="logo" className="w-7 h-7" />
          </Link>

          <div className="hidden md:flex items-center gap-3 min-w-0">
            <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
            <nav className="flex items-center gap-3 min-w-0">
              <Link
                to="/dashboard"
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center shrink-0"
              >
                <Home className="w-5 h-5" />
              </Link>
              {breadcrumbs.map((crumb) =>
                crumb.path === "/dashboard" ? null : (
                  <div key={crumb.path} className="flex items-center gap-3">
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                    {crumb.isLast ? (
                      <span className="text-sm font-inter font-medium text-white/70 truncate">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        to={crumb.path}
                        className="text-sm font-inter font-medium text-gray-400/80 hover:text-gray-200 transition-colors truncate"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                ),
              )}
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative group">
            <Link
              to="/docs"
              className="p-2 hover:bg-gray-800/70 border border-gray-800/40 rounded-lg transition-all duration-200 block"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            </Link>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs text-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 border border-gray-800">
              Help & Support
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-800 rotate-45"></div>
            </div>
          </div>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity group"
            >
              <div className="hidden sm:block text-right min-w-0">
                <p className="text-xs font-medium text-white truncate max-w-30">
                  {getUserDisplayName()}
                </p>
                <p className="text-[10px] text-gray-400">{getGreeting()}</p>
              </div>

              {/* Profile Image or Icon */}
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#028CC0] to-[#0279A6] flex items-center justify-center ring-2 ring-gray-800/60 group-hover:ring-gray-700/60 transition-all overflow-hidden">
                {hasProfilePhoto ? (
                  <img
                    src={userPhotoURL}
                    alt={getUserDisplayName()}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-[#242833] border border-gray-700/60 rounded-xl shadow-2xl py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-700/60">
                    <div className="flex items-center gap-3">
                      {/* Profile Image in Dropdown */}
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#028CC0] to-[#0279A6] flex items-center justify-center ring-2 ring-[#028CC0]/20 overflow-hidden shrink-0">
                        {hasProfilePhoto ? (
                          <img
                            src={userPhotoURL}
                            alt={getUserDisplayName()}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 px-2">
                    <Link
                      to="/account-preferences"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                    >
                      <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      <span className="font-medium">Account Preferences</span>
                    </Link>

                    <Link
                      to="/privacy-policy"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                    >
                      <Shield className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      <span className="font-medium">Privacy Policy</span>
                    </Link>

                    <Link
                      to="/terms-of-service"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                    >
                      <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                      <span className="font-medium">Terms of Service</span>
                    </Link>
                  </div>

                  {signOutError && (
                    <div className="mx-2 mb-2">
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-lg"
                      >
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{signOutError}</span>
                      </motion.div>
                    </div>
                  )}

                  <div className="border-t border-gray-700/60 pt-2 px-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-all duration-150 font-medium group"
                    >
                      <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
