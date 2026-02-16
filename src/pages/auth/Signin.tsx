/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/config";

const Signin = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return "Something went wrong. Please try again.";
    }

    const errorCode = (error as any).code;

    switch (errorCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in cancelled. Please try again.";
      case "auth/cancelled-popup-request":
        return "Sign-in cancelled. Please try again.";
      case "auth/missing-email":
        return "Please enter your email address.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        setError("Please verify your email before signing in.");
        return;
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error: unknown) {
      const errorCode = (error as any)?.code;

      if (errorCode === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (errorCode === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {mode === "signin" ? "Welcome back" : "Reset password"}
          </h1>
          <p className="text-gray-400">
            {mode === "signin"
              ? "Sign in to continue your growth journey"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="bg-[#242833] border border-gray-700/60 rounded-2xl p-8 shadow-2xl">
          {mode === "signin" && (
            <>
              <button
                onClick={handleGoogleSignin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white font-medium hover:bg-[#333846] transition disabled:opacity-50"
              >
                <Chrome size={20} />
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/60"></div>
                </div>
                <div className="relative bg-[#242833] px-4 text-sm text-gray-400">
                  or
                </div>
              </div>
            </>
          )}

          <form
            onSubmit={mode === "signin" ? handleSignin : handleResetPassword}
            className="space-y-4"
          >
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
                  className="w-full pl-10 pr-4 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0]"
                />
              </div>
            </div>

            {mode === "signin" && (
              <div>
                <label className="block text-sm text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#028CC0]"
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
            )}

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

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-lg"
              >
                <Mail size={18} className="shrink-0 mt-0.5" />
                <span>{message}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#028CC0] text-white rounded-lg font-semibold hover:bg-[#0279A6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Send reset link"}
            </button>
          </form>

          {mode === "signin" ? (
            <div className="mt-6 text-center text-sm text-gray-400">
              <button
                onClick={() => setMode("forgot")}
                className="text-[#028CC0] hover:text-[#0279A6] transition"
              >
                Forgot password?
              </button>

              <p className="mt-4">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#028CC0] hover:text-[#0279A6] transition"
                >
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <button
                onClick={() => setMode("signin")}
                className="inline-flex items-center gap-2 text-[#028CC0] hover:text-[#0279A6] text-sm transition"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
