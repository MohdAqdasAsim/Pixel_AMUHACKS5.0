import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../services/config";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 h-16 flex items-center justify-between px-8 py-3 border-b border-gray-400/30 backdrop-blur-md"
    >
      <Link to="/" className="flex items-center justify-center gap-3">
        <img src="/logo.svg" alt="Kryva logo" className="h-8 w-8" />
        <span className="font-plus-jakarta font-bold text-2xl text-white">
          Kryva
        </span>
      </Link>

      <nav className="flex items-center gap-8 font-inter text-sm">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/docs"
            className="font-bold font-inter text-white hover:text-white/80 transition-colors duration-200"
          >
            Docs
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/how-it-works"
            className="font-bold font-inter text-white hover:text-white/80 transition-colors duration-200"
          >
            How it works
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/news"
            className="font-bold font-inter text-white hover:text-white/80 transition-colors duration-200"
          >
            News
          </Link>
        </motion.div>
      </nav>

      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-5 font-inter text-sm relative">
          {!isAuthenticated ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signin"
                  className="font-inter font-semibold text-white hover:text-white/80 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-lg font-inter font-semibold text-white bg-[#0E2332] border-2 border-[#2a4e62] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[--color-accent-primary]/20"
                >
                  Sign up
                </Link>
              </motion.div>
            </>
          ) : (
            <div ref={menuRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-white hover:text-white/80"
              >
                <User size={20} />
              </motion.button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-[#242833] border border-gray-700/60 rounded-lg shadow-lg py-2 flex flex-col"
                >
                  <Link
                    to="/account-preferences"
                    className="px-4 py-2 text-white hover:bg-gray-700/20"
                  >
                    Account Preferences
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="px-4 py-2 text-white hover:bg-gray-700/20"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms-of-service"
                    className="px-4 py-2 text-white hover:bg-gray-700/20"
                  >
                    Terms of Service
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-400 hover:bg-gray-700/20 text-left w-full"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={`https://github.com/MohdAqdasAsim/${import.meta.env.VITE_GITHUB_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors duration-200"
          >
            <Github size={20} />
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
