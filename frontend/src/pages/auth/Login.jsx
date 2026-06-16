import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    });

    if (result.success) {
      navigate(redirectTo);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-premium-gradient px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card>
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <Sparkles className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-950 dark:text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Login to continue your career preparation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              placeholder="dinesh@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              required
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-400">OR</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {}}
              theme="filled_black"
              shape="pill"
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            New to HireGenie AI?{" "}
            <Link to="/register" className="font-semibold text-indigo-300">
              Create account
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
