import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpenCheck,
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
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "../../assets/hero.png";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const readinessStats = [
  { label: "Resume score", value: "88%", tone: "text-emerald-300" },
  { label: "Interview trend", value: "+24%", tone: "text-sky-300" },
  { label: "Job matches", value: "14", tone: "text-amber-300" }
];

const modules = [
  {
    icon: FileText,
    title: "Resume Intelligence",
    description:
      "Parse resumes, surface missing keywords, estimate ATS readiness, and turn feedback into a prioritized edit list."
  },
  {
    icon: Mic,
    title: "Interview Studio",
    description:
      "Practice HR and technical rounds with saved attempts, structured scoring, and coaching notes after every session."
  },
  {
    icon: Code2,
    title: "Coding Arena",
    description:
      "Work through coding problems, track accepted submissions, and keep placement preparation visible from the dashboard."
  },
  {
    icon: Target,
    title: "Aptitude Hub",
    description:
      "Run timed MCQ practice with auto-evaluation, score history, and topic-level feedback for sharper prep."
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Generate weekly plans with projects, certifications, study checkpoints, and role-specific preparation strategy."
  },
  {
    icon: Briefcase,
    title: "Job Tracker",
    description:
      "Match skills to internships and jobs, save opportunities, and keep applications connected to readiness work."
  }
];

const workflow = [
  {
    title: "Profile",
    description: "Capture goals, skills, education, and target roles."
  },
  {
    title: "Diagnose",
    description: "Analyze resume strength, aptitude gaps, and interview confidence."
  },
  {
    title: "Practice",
    description: "Move through focused coding, MCQ, and mock interview sessions."
  },
  {
    title: "Apply",
    description: "Use matched jobs, certificates, and reports to support applications."
  }
];

const plans = [
  {
    name: "Student",
    price: "Free",
    description: "For getting started with the career workspace.",
    features: ["Resume analysis", "Dashboard", "Coding practice", "Roadmap preview"]
  },
  {
    name: "Pro",
    price: "Rs 299/mo",
    description: "For students preparing seriously for interviews.",
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
    description: "For placement cells and cohort tracking.",
    features: ["Admin panel", "Student analytics", "Bulk certificates", "Placement dashboard"]
  }
];

const faqs = [
  {
    question: "Can I use HireGenie AI as a portfolio project?",
    answer:
      "Yes. It combines a React dashboard, Django REST APIs, authentication, AI-assisted workflows, analytics, certificates, and deployment structure."
  },
  {
    question: "What does the dashboard help students track?",
    answer:
      "Students can monitor resume readiness, mock interview performance, coding progress, aptitude scores, job matches, and recent activity."
  },
  {
    question: "Can the AI provider be changed?",
    answer:
      "Yes. The backend uses a reusable AI service layer, so providers such as Gemini or OpenAI can be wired in from configuration."
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-premium-gradient text-white">
      <Navbar />

      <main>
        <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge>
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                AI career workspace for students
              </Badge>

              <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                HireGenie AI turns preparation into a clear job-ready plan.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Bring resumes, mock interviews, coding practice, aptitude tests,
                roadmaps, certificates, and job matches into one focused student
                dashboard.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Button as={Link} to="/register" className="w-full sm:w-auto">
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  as="a"
                  href="#features"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Explore Features
                </Button>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {readinessStats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-lg p-4">
                    <p className={`text-2xl font-black ${stat.tone}`}>{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative"
            >
              <Card className="overflow-hidden rounded-lg p-0">
                <div className="border-b border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Career Readiness
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Live student workspace
                      </p>
                    </div>

                    <img
                      src={heroImage}
                      alt=""
                      className="h-14 w-14 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="grid gap-4 p-5">
                  <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">ATS Score</p>
                        <p className="mt-2 text-5xl font-black">88%</p>
                      </div>
                      <ShieldCheck className="h-12 w-12 text-emerald-300" />
                    </div>

                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[88%] rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Interview", "82%", Mic, "text-sky-300"],
                      ["Coding", "27 solved", Code2, "text-indigo-300"],
                      ["Aptitude", "91%", Brain, "text-amber-300"],
                      ["Jobs", "14 matches", Briefcase, "text-emerald-300"]
                    ].map(([label, value, Icon, tone]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                      >
                        <Icon className={`h-6 w-6 ${tone}`} />
                        <p className="mt-4 text-sm text-slate-400">{label}</p>
                        <p className="mt-1 text-2xl font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm font-semibold text-emerald-100">
                      Next best action
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-50/80">
                      Add two measurable project outcomes before applying to
                      React internships.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Badge>Platform Modules</Badge>
              <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                The pieces students usually juggle, connected in one place.
              </h2>
              <p className="mt-5 text-slate-400">
                Each module feeds the dashboard, so progress is visible across
                resume quality, practice consistency, skill growth, and job search
                readiness.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => {
                const Icon = module.icon;

                return (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="h-full rounded-lg">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-indigo-200">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mt-6 text-xl font-bold">{module.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {module.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-start">
              <div>
                <Badge>How It Works</Badge>
                <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                  A practical loop for student placement prep.
                </h2>
                <p className="mt-5 text-slate-400">
                  HireGenie keeps the workflow simple: capture the student goal,
                  diagnose gaps, practice deliberately, and apply with stronger
                  evidence.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {workflow.map((step, index) => (
                  <Card key={step.title} className="rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-4">
              {[
                [Bot, "AI feedback", "Reusable AI service for coaching and report generation."],
                [BarChart3, "Analytics", "Charts for skill growth, scores, activity, and readiness."],
                [Award, "Certificates", "Generate polished proof of practice and completion."],
                [Zap, "Deployable stack", "React, Django REST, Docker, and structured app modules."]
              ].map(([Icon, title, description]) => (
                <Card key={title} className="rounded-lg">
                  <Icon className="h-8 w-8 text-sky-300" />
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge>Plans</Badge>
              <h2 className="mt-6 text-4xl font-bold">Simple paths to start.</h2>
              <p className="mt-4 text-slate-400">
                Keep the free path approachable, then unlock deeper feedback and
                reporting for serious preparation.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`rounded-lg ${
                    plan.highlighted
                      ? "border-emerald-300/40 bg-emerald-400/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {plan.description}
                      </p>
                    </div>
                    {plan.highlighted && (
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-4xl font-black">{plan.price}</p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <p
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        {feature}
                      </p>
                    ))}
                  </div>

                  <Button as={Link} to="/register" className="mt-8 w-full">
                    Choose Plan
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Badge>FAQ</Badge>
              <h2 className="mt-6 text-4xl font-bold">Common Questions</h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.question} className="rounded-lg">
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-lg border border-white/10 bg-white/[0.06] p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <div className="flex items-center gap-3 text-emerald-200">
                <BookOpenCheck className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Ready to begin
                </p>
              </div>
              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Start with the dashboard, then let every practice session improve
                the plan.
              </h2>
            </div>

            <Button
              as={Link}
              to="/register"
              className="w-full bg-white text-indigo-700 hover:bg-slate-100 md:w-auto"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
