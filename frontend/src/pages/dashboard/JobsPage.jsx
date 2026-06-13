import { Bookmark, Briefcase, ExternalLink, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";

function getListData(response) {
  return response.data.results || response.data.data || response.data || [];
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const loadJobs = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (jobType) params.append("job_type", jobType);
      if (workMode) params.append("work_mode", workMode);

      const response = await api.get(`/jobs/recommended/?${params.toString()}`);
      setJobs(response.data.data || getListData(response));
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await api.get("/saved-jobs/");
      setSavedJobs(getListData(response));
    } catch {
      setSavedJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [jobType, workMode]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const saveJob = async (job) => {
    setSavingId(job.id);

    try {
      await api.post("/saved-jobs/", {
        job_id: job.id,
        status: "saved"
      });

      toast.success("Job saved");
      loadSavedJobs();
    } catch {
      toast.error("Failed to save job");
    } finally {
      setSavingId(null);
    }
  };

  const savedJobIds = new Set(savedJobs.map((item) => item.job?.id));

  return (
    <div>
      <PageHeader
        badge="Job Recommendation Engine"
        title="Find internships and jobs based on your skills"
        description="Get recommended opportunities, save jobs, and track your application pipeline."
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Filters
          </h2>

          <div className="mt-6 space-y-5">
            <Select
              label="Job Type"
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
            >
              <option value="">All</option>
              <option value="internship">Internship</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </Select>

            <Select
              label="Work Mode"
              value={workMode}
              onChange={(event) => setWorkMode(event.target.value)}
            >
              <option value="">All</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </Select>

            <Button
              variant="secondary"
              onClick={() => {
                setJobType("");
                setWorkMode("");
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          <div className="mt-8 rounded-3xl bg-indigo-500/10 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Saved Jobs
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
              {savedJobs.length}
            </p>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-3">
          {loading ? (
            <Card>
              <p className="text-sm text-slate-400">Loading recommended jobs...</p>
            </Card>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Run python manage.py seed_data or update your profile skills to get job recommendations."
            />
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                        <Briefcase className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {job.location || "Remote"} • {job.work_mode} • {job.job_type}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.required_skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm font-semibold text-emerald-400">
                      {job.salary_range || "Salary not disclosed"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3">
                    <span className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-center text-sm font-bold text-emerald-400">
                      {job.match_score || 0}% Match
                    </span>

                    <Button
                      onClick={() => saveJob(job)}
                      loading={savingId === job.id}
                      disabled={savedJobIds.has(job.id)}
                    >
                      <Bookmark className="h-4 w-4" />
                      {savedJobIds.has(job.id) ? "Saved" : "Save"}
                    </Button>

                    {job.apply_url && (
                      <a href={job.apply_url} target="_blank" rel="noreferrer">
                        <Button variant="secondary" className="w-full">
                          Apply
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;