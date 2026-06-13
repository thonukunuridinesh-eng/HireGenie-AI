import { BarChart3, Brain, Code2, FileText, Mic, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import api from "../../api/axios";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";

const fallbackStats = {
  ats_score: 0,
  interview_performance: 0,
  coding_progress: 0,
  aptitude_score: 0,
  profile_points: 0,
  skill_growth: [
    { month: "Jan", score: 20 },
    { month: "Feb", score: 35 },
    { month: "Mar", score: 45 },
    { month: "Apr", score: 60 },
    { month: "May", score: 76 },
    { month: "Jun", score: 88 }
  ]
};

function AnalyticsPage() {
  const [stats, setStats] = useState(fallbackStats);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const dashboardResponse = await api.get("/dashboard/");
        setStats(dashboardResponse.data.data || fallbackStats);
      } catch {
        setStats(fallbackStats);
      }

      try {
        const activitiesResponse = await api.get("/activities/");
        setActivities(
          activitiesResponse.data.results ||
            activitiesResponse.data.data ||
            activitiesResponse.data ||
            []
        );
      } catch {
        setActivities([]);
      }
    };

    loadAnalytics();
  }, []);

  const moduleData = [
    { name: "ATS", value: stats.ats_score },
    { name: "Interview", value: stats.interview_performance },
    { name: "Aptitude", value: stats.aptitude_score },
    { name: "Points", value: Math.min(stats.profile_points || 0, 100) }
  ];

  const activityModuleCounts = activities.reduce((accumulator, activity) => {
    accumulator[activity.module] = (accumulator[activity.module] || 0) + 1;
    return accumulator;
  }, {});

  const activityData = Object.entries(activityModuleCounts).map(
    ([module, count]) => ({
      module,
      count
    })
  );

  return (
    <div>
      <PageHeader
        badge="Analytics"
        title="Track your career preparation performance"
        description="Analyze your ATS score, interview performance, coding progress, aptitude results, points, and activity trends."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="ATS"
          value={`${stats.ats_score}%`}
          subtitle="Resume readiness"
          icon={FileText}
        />

        <StatCard
          title="Interview"
          value={`${stats.interview_performance}%`}
          subtitle="Mock performance"
          icon={Mic}
        />

        <StatCard
          title="Coding"
          value={stats.coding_progress}
          subtitle="Solved problems"
          icon={Code2}
        />

        <StatCard
          title="Aptitude"
          value={`${stats.aptitude_score}%`}
          subtitle="Average score"
          icon={Brain}
        />

        <StatCard
          title="Points"
          value={stats.profile_points || 0}
          subtitle="Total earned"
          icon={Trophy}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Readiness Score
          </h2>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleData}>
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

        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Skill Growth Trend
          </h2>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.skill_growth}>
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
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#818cf8"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Activity by Module
          </h2>

          <div className="mt-6 h-80">
            {activityData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No activity data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="module" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(148,163,184,0.25)",
                      borderRadius: "16px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Recent Activity Timeline
          </h2>

          <div className="mt-6 space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400">No activities yet.</p>
            ) : (
              activities.slice(0, 8).map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {activity.action}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-wide text-indigo-400">
                    {activity.module}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;