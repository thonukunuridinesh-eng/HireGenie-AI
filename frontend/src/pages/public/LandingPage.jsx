import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  FileText,
  Map,
  Mic,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description:
      "Upload resume PDFs, extract skills, check ATS score, find missing keywords, and get AI suggestions."
  },
  {
    icon: Mic,
    title: "AI Mock Interview",
    description:
      "Practice HR and technical questions with AI feedback, scoring, and saved interview history."
  },
  {
    icon: Code2,
    title: "Coding Arena",
    description:
      "Solve coding problems, submit solutions, track progress, and compete on the leaderboard."
  },
  {
    icon: Target,
    title: "Aptitude Practice",
    description:
      "Take timed MCQ tests with auto evaluation, result history, and performance analytics."
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Generate weekly learning plans, project ideas, certifications, and preparation strategy."
  },
  {
    icon: Briefcase,
    title: "Job Recommendations",
    description:
      "Match your skills with internships and jobs. Save opportunities and track applications."
  }
];

const steps = [
  "Create your student profile",
  "Upload resume or choose your career goal",
  "Practice interviews, coding, and aptitude",
  "Download reports, certificates, and roadmap"
];

const pricing = [
  {
    name: "Student",
    price: "Free",
    features: ["Resume analysis", "Dashboard", "Coding practice", "Roadmap preview"]
  },
  {
    name: "Pro",
    price: "₹299/mo",
    features: [
      "AI interview feedback",
      "Unlimited reports",
      "Certificates",
      "Advanced analytics"
    ],
    highlighted: true
  },
  {
    name: "Campus",
    price: "Custom",
    features: ["Admin panel", "Student analytics", "Bulk certificates", "Placement dashboard"]
  }
];

const faqs = [
  {
    question: "Is HireGenie AI good for resume projects?",
    answer:
      "Yes. It combines Django REST APIs, React UI, AI integration, dashboard analytics, PDF generation, authentication, and deployment."
  },
  {
    question: "Can I show this in internship interviews?",
    answer:
      "Yes. It is designed like a real SaaS project with practical career features and clean full-stack architecture."
  },
  {
    question: "Does it support AI APIs?",
    answer:
      "Yes. The backend supports Gemini API or OpenAI API using a reusable AI service."
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-premium-gradient text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6 lg:px-8">
          <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge>
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Premium AI Career Ecosystem
              </Badge>

              <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
                Build your career with{" "}
                <span className="gradient-text">HireGenie AI</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                An AI-powered platform that helps students build resumes,
                prepare for interviews, practice coding, improve ATS scores, and
                get personalized career roadmaps.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link to="/register">
                  <Button className="w-full sm:w-auto">
                    Start Building
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <a href="#features">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </a>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                {[
                  ["12+", "AI Tools"],
                  ["100%", "Responsive"],
                  ["SaaS", "Architecture"]
                ].map(([value, label]) => (
                  <div key={label} className="glass-card rounded-2xl p-4">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-indigo-500/30 to-sky-500/20 blur-3xl" />

              <Card className="relative overflow-hidden p-0">
                <div className="border-b border-white/10 p-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 p-6">
                    <p className="text-sm text-indigo-100">ATS Score</p>
                    <div className="mt-4 flex items-end justify-between">
                      <h3 className="text-6xl font-black">88%</h3>
                      <ShieldCheck className="h-12 w-12 text-white/80" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Interview", "82%", Mic],
                      ["Coding", "27 solved", Code2],
                      ["Aptitude", "91%", Brain],
                      ["Jobs", "14 matches", Briefcase]
                    ].map(([label, value, Icon]) => (
                      <div
                        key={label}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5"
                      >
                        <Icon className="h-6 w-6 text-indigo-300" />
                        <p className="mt-4 text-sm text-slate-400">{label}</p>
                        <p className="mt-1 text-2xl font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge>Platform Features</Badge>
              <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                Everything a student needs to become job-ready
              </h2>
              <p className="mt-5 text-slate-400">
                Resume, interview, coding, aptitude, roadmap, jobs, and
                certificates in one premium full-stack platform.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Badge>How it works</Badge>
                <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                  From beginner student to interview-ready candidate
                </h2>
                <p className="mt-5 text-slate-400">
                  HireGenie AI gives a clear journey: analyze, improve, practice,
                  track, and apply.
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <Card key={step} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-bold">
                      {index + 1}
                    </div>
                    <p className="font-semibold">{step}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Card className="overflow-hidden p-8 md:p-12">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <Badge>AI Tools Showcase</Badge>

                  <h2 className="mt-6 text-4xl font-bold">
                    Built with real-world SaaS architecture
                  </h2>

                  <p className="mt-5 text-slate-400">
                    This project is strong for GitHub, resume, internship
                    submission, and demo videos because it includes backend APIs,
                    authentication, AI logic, charts, reports, certificates, and
                    deployment-ready structure.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [Bot, "AI Feedback"],
                    [BarChart3, "Analytics"],
                    [Award, "Certificates"],
                    [Zap, "Fast APIs"]
                  ].map(([Icon, label]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <Icon className="h-8 w-8 text-indigo-300" />
                      <p className="mt-4 font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Badge>Testimonials</Badge>

            <h2 className="mt-6 text-4xl font-bold">
              Designed for students, recruiters, and placement preparation
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {["Excellent project for resume", "Premium UI and clean APIs", "Perfect for demo video"].map(
                (text) => (
                  <Card key={text}>
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Star key={item} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-5 text-slate-300">{text}</p>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge>Pricing</Badge>
              <h2 className="mt-6 text-4xl font-bold">Simple SaaS pricing UI</h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pricing.map((plan) => (
                <Card
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? "border-indigo-400/50 bg-indigo-500/10"
                      : ""
                  }
                >
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-4 text-4xl font-black">{plan.price}</p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <p
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {feature}
                      </p>
                    ))}
                  </div>

                  <Link to="/register">
                    <Button className="mt-8 w-full">
                      Choose Plan
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Badge>FAQ</Badge>
              <h2 className="mt-6 text-4xl font-bold">Common Questions</h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-indigo-500 to-sky-500 p-10 text-center shadow-glow">
            <h2 className="text-4xl font-black">Ready to build your career ecosystem?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
              Start using HireGenie AI and showcase it as a major Python Full
              Stack project.
            </p>

            <Link to="/register">
              <Button className="mt-8 bg-white text-indigo-600 hover:bg-slate-100">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;