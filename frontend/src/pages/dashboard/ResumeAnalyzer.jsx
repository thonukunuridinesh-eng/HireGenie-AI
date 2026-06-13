import { motion } from "framer-motion";
import { Download, FileText, Loader2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

function getListData(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function getBackendErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;

  console.log("Backend error status:", error?.response?.status);
  console.log("Backend error data:", data);

  if (!data) return fallback;

  if (typeof data === "string") {
    if (data.includes("OperationalError")) {
      return "Backend database error. Check Django terminal for exact error.";
    }

    if (data.includes("no such table")) {
      return "Database table missing. Run migrations in backend.";
    }

    return fallback;
  }

  if (data.message) return data.message;

  if (data.detail) return data.detail;

  if (data.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = data.errors[firstKey];

    if (Array.isArray(firstError)) {
      return `${firstKey}: ${firstError[0]}`;
    }

    if (typeof firstError === "string") {
      return `${firstKey}: ${firstError}`;
    }

    if (typeof firstError === "object") {
      return `${firstKey}: ${JSON.stringify(firstError)}`;
    }
  }

  if (data.pdf_file?.[0]) return data.pdf_file[0];
  if (data.title?.[0]) return data.title[0];
  if (data.target_role?.[0]) return data.target_role[0];

  return fallback;
}

function ResumeAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    target_role: "Python Full Stack Developer",
    pdf_file: null
  });

  const loadResumes = async () => {
    setLoading(true);

    try {
      const response = await api.get("/resumes/");
      const list = getListData(response);

      console.log("Loaded resumes:", list);

      setResumes(list);
    } catch (error) {
      console.log("Load resumes error:", error);

      const message = getBackendErrorMessage(
        error,
        "Failed to load resumes. Check backend routes and migrations."
      );

      toast.error(message);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: files ? files[0] : value
    }));
  };

  const validateUploadForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter resume title");
      return false;
    }

    if (!formData.target_role.trim()) {
      toast.error("Please enter target role");
      return false;
    }

    if (!formData.pdf_file) {
      toast.error("Please select a resume PDF");
      return false;
    }

    const fileName = formData.pdf_file.name.toLowerCase();

    if (!fileName.endsWith(".pdf")) {
      toast.error("Only PDF files are allowed");
      return false;
    }

    const maxSize = 5 * 1024 * 1024;

    if (formData.pdf_file.size > maxSize) {
      toast.error("PDF size must be less than 5 MB");
      return false;
    }

    return true;
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!validateUploadForm()) return;

    setUploading(true);

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("target_role", formData.target_role.trim());
    payload.append("pdf_file", formData.pdf_file);

    try {
      console.log("Uploading resume:", {
        title: formData.title,
        target_role: formData.target_role,
        file_name: formData.pdf_file.name,
        file_size: formData.pdf_file.size
      });

      const response = await api.post("/resumes/", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Resume upload success:", response.data);

      toast.success("Resume uploaded successfully");

      setFormData({
        title: "",
        target_role: "Python Full Stack Developer",
        pdf_file: null
      });

      event.target.reset();

      await loadResumes();
    } catch (error) {
      console.log("Resume upload error full:", error);

      const message = getBackendErrorMessage(
        error,
        "Resume upload failed. Check Django backend terminal."
      );

      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId);

    try {
      const response = await api.post(`/resumes/${resumeId}/analyze/`);

      console.log("ATS analysis success:", response.data);

      toast.success("ATS analysis completed");

      await loadResumes();
    } catch (error) {
      console.log("Analyze resume error full:", error);

      const message = getBackendErrorMessage(
        error,
        "Failed to analyze resume. Check backend terminal."
      );

      toast.error(message);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDownloadReport = async (resume) => {
    setDownloadingId(resume.id);

    try {
      const response = await api.get(`/resumes/${resume.id}/download_report/`, {
        responseType: "blob"
      });

      const blob = new Blob([response.data], {
        type: "application/pdf"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${resume.title}-ats-report.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("ATS report downloaded");
    } catch (error) {
      console.log("Download report error full:", error);

      const message = getBackendErrorMessage(
        error,
        "Analyze resume first, then download report."
      );

      toast.error(message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        badge="AI Resume Analyzer"
        title="Upload resume and improve your ATS score"
        description="Upload a PDF resume, extract skills, calculate ATS score, identify missing keywords, and download a professional ATS report."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            <UploadCloud className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Upload Resume
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Upload only PDF files below 5 MB.
          </p>

          <form onSubmit={handleUpload} className="mt-6 space-y-5">
            <Input
              label="Resume Title"
              name="title"
              placeholder="My Python Resume"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Target Role"
              name="target_role"
              placeholder="Python Full Stack Developer"
              value={formData.target_role}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Resume PDF
              </label>

              <input
                type="file"
                name="pdf_file"
                accept="application/pdf,.pdf"
                onChange={handleChange}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                required
              />

              {formData.pdf_file && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Selected: {formData.pdf_file.name}
                </p>
              )}
            </div>

            <Button type="submit" loading={uploading} className="w-full">
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          {loading ? (
            <Card>
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading resumes...
              </div>
            </Card>
          ) : resumes.length === 0 ? (
            <EmptyState
              title="No resumes uploaded"
              description="Upload your first resume PDF to generate an ATS score and improvement suggestions."
            />
          ) : (
            <div className="space-y-5">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                          <FileText className="h-7 w-7" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                            {resume.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Target Role: {resume.target_role || "Not provided"}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-wide text-indigo-400">
                            Status: {resume.status}
                          </p>

                          {resume.ats_report ? (
                            <div className="mt-4">
                              <div className="flex items-center gap-3">
                                <div className="text-4xl font-black text-slate-950 dark:text-white">
                                  {resume.ats_report.score}%
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                    ATS Score
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Latest AI analysis
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="rounded-2xl bg-emerald-500/10 p-4">
                                  <p className="text-sm font-semibold text-emerald-300">
                                    Matched Keywords
                                  </p>

                                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {resume.ats_report.matched_keywords?.length
                                      ? resume.ats_report.matched_keywords.join(", ")
                                      : "No matched keywords"}
                                  </p>
                                </div>

                                <div className="rounded-2xl bg-rose-500/10 p-4">
                                  <p className="text-sm font-semibold text-rose-300">
                                    Missing Keywords
                                  </p>

                                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {resume.ats_report.missing_keywords?.length
                                      ? resume.ats_report.missing_keywords.join(", ")
                                      : "No missing keywords"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 rounded-2xl bg-white/5 p-4">
                                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                  AI Suggestions
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500 dark:text-slate-400">
                                  {resume.ats_report.suggestions ||
                                    "No suggestions available."}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4 rounded-2xl bg-amber-500/10 p-4">
                              <p className="text-sm font-semibold text-amber-300">
                                Not analyzed yet
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Click Analyze to generate ATS score and suggestions.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                        <Button
                          onClick={() => handleAnalyze(resume.id)}
                          loading={analyzingId === resume.id}
                        >
                          {analyzingId === resume.id ? "Analyzing..." : "Analyze"}
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleDownloadReport(resume)}
                          loading={downloadingId === resume.id}
                          disabled={!resume.ats_report}
                        >
                          <Download className="h-4 w-4" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;