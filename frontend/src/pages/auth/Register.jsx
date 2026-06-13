import { motion } from "framer-motion";
import { Briefcase, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    target_role: "Python Full Stack Developer"
  });

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await register(formData);

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
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start your AI-powered career preparation journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="full_name"
              icon={User}
              placeholder="Dinesh Thonukunuri"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              placeholder="dinesh@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Target Role"
              name="target_role"
              icon={Briefcase}
              placeholder="Python Full Stack Developer"
              value={formData.target_role}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-300">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default Register;