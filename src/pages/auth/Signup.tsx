/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/config";

const Signup = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return "Something went wrong. Please try again.";
    }

    const errorCode = (error as any).code;

    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-up cancelled. Please try again.";
      case "auth/cancelled-popup-request":
        return "Sign-up cancelled. Please try again.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with this email using a different sign-in method.";
      case "auth/popup-blocked":
        return "Pop-up was blocked. Please allow pop-ups and try again.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await sendEmailVerification(userCredential.user);

      setShowModal(true);

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);

      if (
        result.user.emailVerified ||
        result.user.providerData[0]?.providerId === "google.com"
      ) {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#242832] p-6 rounded-xl border border-[#2F3542] text-center max-w-sm mx-4"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-400" size={24} />
            </div>
            <h2 className="text-white text-lg font-semibold mb-2">
              Verification Email Sent
            </h2>
            <p className="text-gray-400 text-sm">
              Please check your inbox and verify your email before signing in.
            </p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create an account
          </h1>
          <p className="text-gray-400">Start your growth journey today</p>
        </div>

        <div className="bg-[#242832] border border-[#2F3542] rounded-2xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2A2F3A] border border-[#3A404F] rounded-lg text-white font-medium hover:bg-[#323847] transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3A404F]" />
            </div>
            <div className="relative bg-[#242832] px-4 text-sm text-gray-400">
              or
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-2">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2F3A] border border-[#3A404F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0288B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full pl-10 pr-12 py-3 bg-[#2A2F3A] border border-[#3A404F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0288B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 bg-[#2A2F3A] border border-[#3A404F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0288B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0288B8] text-white rounded-lg font-semibold hover:bg-[#0277A3] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#0288B8] hover:text-[#0277A3] transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
