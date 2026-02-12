import { Link } from "react-router-dom";
import {
  HelpCircle,
  User,
  Settings,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/config";

const Breadcrumb = () => {
  const { user } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="border-b border-gray-800/50 pl-4 px-6 py-3 bg-[#0E131C]">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center ">
          <Link to="/dashboard">
            <img src="/logo.svg" alt="logo" className="w-8 aspect-square" />
          </Link>
        </div>

        {/* Right side - Notifications, Help and Profile */}
        <div className="flex items-center gap-3">
          {/* Help Button */}
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

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#028CC0] to-[#0279A6] flex items-center justify-center ring-2 ring-gray-800/60 hover:ring-gray-700/60 transition-all">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#242833] border border-gray-700/60 rounded-xl shadow-2xl py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#028CC0] to-[#0279A6] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.email?.split("@")[0] || "Student"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2 px-2">
                  <Link
                    to="/account-preferences"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-medium">Account Preferences</span>
                  </Link>

                  <Link
                    to="/privacy-policy"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                  >
                    <Shield className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-medium">Privacy Policy</span>
                  </Link>

                  <Link
                    to="/terms-of-service"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800/70 rounded-lg flex items-center gap-3 transition-all duration-150 group"
                  >
                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-medium">Terms of Service</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700/60 pt-2 px-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-all duration-150 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
