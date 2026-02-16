import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, User, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../services/config";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-400/30 backdrop-blur-md"
      >
        <Link
          to="/"
          className="flex items-center justify-center gap-2 sm:gap-3"
        >
          <img
            src="/logo.svg"
            alt="Kryva logo"
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
          <span className="font-plus-jakarta font-bold text-xl sm:text-2xl text-white">
            Kryva
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-inter text-sm">
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

        <div className="hidden lg:flex flex-row items-center gap-4">
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
                    className="px-3 py-2 rounded-lg font-inter font-semibold text-white bg-[#0E2332] border-2 border-[#2a4e62] transition-all duration-200 shadow-md hover:shadow-lg"
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
                  aria-label="User menu"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-white hover:text-white/80"
                >
                  <User size={20} />
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#242833] border border-gray-700/60 rounded-lg shadow-lg py-2 flex flex-col"
                    >
                      <Link
                        to="/account-preferences"
                        className="px-4 py-2 text-white hover:bg-gray-700/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        Account Preferences
                      </Link>
                      <Link
                        to="/privacy-policy"
                        className="px-4 py-2 text-white hover:bg-gray-700/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        to="/terms-of-service"
                        className="px-4 py-2 text-white hover:bg-gray-700/20"
                        onClick={() => setMenuOpen(false)}
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
                </AnimatePresence>
              </div>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`https://github.com/MohdAqdasAsim/${import.meta.env.VITE_GITHUB_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors duration-200"
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`https://github.com/MohdAqdasAsim/${import.meta.env.VITE_GITHUB_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors duration-200"
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-white/80 transition-colors duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-full sm:w-80 bg-linear-to-b from-[#1a1d28] to-[#0f1117] border-l border-gray-700/60 shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <nav className="flex flex-col p-6 space-y-6">
                <div className="flex flex-col space-y-2">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                  >
                    Navigation
                  </motion.h3>

                  {[
                    { to: "/docs", label: "Docs" },
                    { to: "/how-it-works", label: "How it works" },
                    { to: "/news", label: "News" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.to}
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={item.to}
                        className="group flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-white/10 font-semibold transition-all duration-200 border border-transparent hover:border-white/20"
                        onClick={closeMobileMenu}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-white/40"
                />

                <div className="flex flex-col space-y-2">
                  {!isAuthenticated ? (
                    <>
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                      >
                        Account
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-row gap-3 items-center"
                      >
                        <motion.div
                          custom={3}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex-1"
                        >
                          <Link
                            to="/signin"
                            className="group flex items-center justify-center px-4 py-3 rounded-lg text-white hover:bg-white/10 font-semibold transition-all duration-200 border border-white/20 hover:border-white/40"
                            onClick={closeMobileMenu}
                          >
                            <span>Sign in</span>
                          </Link>
                        </motion.div>

                        <motion.div
                          custom={4}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex-1"
                        >
                          <Link
                            to="/signup"
                            className="flex items-center justify-center px-4 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                            onClick={closeMobileMenu}
                          >
                            Sign up
                          </Link>
                        </motion.div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                      >
                        Account
                      </motion.h3>

                      {[
                        {
                          to: "/account-preferences",
                          label: "Account Preferences",
                        },
                        { to: "/privacy-policy", label: "Privacy Policy" },
                        { to: "/terms-of-service", label: "Terms of Service" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.to}
                          custom={i + 3}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            to={item.to}
                            className="group flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-white/10 font-semibold transition-all duration-200 border border-transparent hover:border-white/20"
                            onClick={closeMobileMenu}
                          >
                            <span>{item.label}</span>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                          </Link>
                        </motion.div>
                      ))}

                      <motion.div
                        custom={6}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full group flex items-center justify-between px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-semibold transition-all duration-200 border border-transparent hover:border-red-500/30"
                        >
                          <span>Log Out</span>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                        </button>
                      </motion.div>
                    </>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6 mt-auto"
                >
                  <div className="px-4 py-3 rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <p className="text-xs text-gray-400 text-center">
                      Kryva - Consequence-Aware Learning
                    </p>
                  </div>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
