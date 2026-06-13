import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  Brain,
  Briefcase,
  Code2,
  FileText,
  Mic,
  Trophy
} from "lucide-react";

import api from "../../api/axios";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Skeleton from "../../components/ui/Skeleton";
import StatCard from "../../components/ui/StatCard";
import { useAuth } from "../../context/AuthContext";

const fallbackStats = {
  ats_score: 0,
  interview_performance: 0,
  coding_progress: 0,
  aptitude_score: 0,
  uploaded_resumes: 0,
  saved_jobs: 0,
  profile_points: 0,
  recent_activities: [],
  recommended_jobs: [],
  skill_growth: [
    { month: "Jan", score: 20 },
    { month: "Feb", score: 35 },
    { month: "Mar", score: 45 },
    { month: "Apr", score: 60 },
    { month: "May", score: 76 },
    { month: "Jun", score: 88 }
  ]
};

function DashboardHome() {
  const { profile } = useAuth();

  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/");
        setStats(response.data.data);
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const barData = [
    { name: "ATS", value: stats.ats_score },
    { name: "Interview", value: stats.interview_performance },
    { name: "Aptitude", value: stats.aptitude_score },
    { name: "Points", value: Math.min(stats.profile_points, 100) }
  ];

  if (loading) {
    return (
      <div>
        <PageHeader
          badge="Dashboard"
          title="Loading your career workspace..."
          description="Fetching ATS score, interview progress, coding stats, aptitude performance, jobs, and activity logs."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-40" />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge="Student Dashboard"
        title={`Welcome back, ${profile?.full_name || "Student"} 👋`}
        description="Track your resume strength, interview performance, coding progress, aptitude score, skill growth, and job recommendations."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="ATS Score"
          value={`${stats.ats_score}%`}
          subtitle="Latest resume analysis"
          icon={FileText}
        />

        <StatCard
          title="Interview Score"
          value={`${stats.interview_performance}%`}
          subtitle="Average mock interview performance"
          icon={Mic}
        />

        <StatCard
          title="Coding Progress"
          value={stats.coding_progress}
          subtitle="Accepted coding problems"
          icon={Code2}
        />

        <StatCard
          title="Aptitude Score"
          value={`${stats.aptitude_score}%`}
          subtitle="Average aptitude performance"
          icon={Brain}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Skill Growth
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Monthly improvement overview
              </p>
            </div>

            <Activity className="h-6 w-6 text-indigo-400" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.skill_growth}>
                <defs>
                  <linearGradient id="skillGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: "16px",
                    color: "#fff"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818cf8"
                  fillOpacity={1}
                  fill="url(#skillGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Performance Mix
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Career readiness modules
              </p>
            </div>

            <Trophy className="h-6 w-6 text-amber-400" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: "16px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Recent Activities
          </h2>

          <div className="mt-6 space-y-4">
            {stats.recent_activities.length === 0 ? (
              <EmptyState
                title="No activities yet"
                description="Upload a resume, start an interview, solve coding problems, or generate a roadmap to see activity here."
              />
            ) : (
              stats.recent_activities.map((activity, index) => (
                <div
                  key={`${activity.action}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {activity.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            Recommended Jobs
          </h2>

          <div className="mt-6 space-y-4">
            {stats.recommended_jobs.length === 0 ? (
              <EmptyState
                title="No recommended jobs yet"
                description="Update your skills in profile to get better job recommendations."
              />
            ) : (
              stats.recommended_jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {job.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {job.company} • {job.location || "Remote"}
                      </p>
                    </div>

                    <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                      {job.job_type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHome;