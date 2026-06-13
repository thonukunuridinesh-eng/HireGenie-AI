import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    toast.success(
      "Password reset UI is ready. Backend email reset can be added later."
    );
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
          <h1 className="text-center text-3xl font-bold text-slate-950 dark:text-white">
            Forgot password?
          </h1>

          <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
            Enter your email address. This premium UI is ready for email reset
            backend integration.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="dinesh@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Remember password?{" "}
            <Link to="/login" className="font-semibold text-indigo-300">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;