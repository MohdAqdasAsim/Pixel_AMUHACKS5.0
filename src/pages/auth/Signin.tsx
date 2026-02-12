import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft } from "lucide-react";
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
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
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-[#2B303B] border border-gray-700/60 rounded-lg text-white font-medium hover:bg-[#333846] transition"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-lg">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#028CC0] text-white rounded-lg font-semibold hover:bg-[#0279A6] transition disabled:opacity-50"
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
                className="text-[#028CC0] hover:text-[#0279A6]"
              >
                Forgot password?
              </button>

              <p className="mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#028CC0] hover:text-[#0279A6]"
                >
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <button
                onClick={() => setMode("signin")}
                className="flex items-center justify-center gap-2 text-[#028CC0] hover:text-[#0279A6] text-sm"
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
