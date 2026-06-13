import { Award, Download, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

function getListData(response) {
  return response.data.results || response.data.data || response.data || [];
}

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [form, setForm] = useState({
    title: "Python Full Stack Achievement Certificate",
    issued_for: "HireGenie AI Career Preparation",
    score: 85
  });

  const backendBaseUrl = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    return apiBase.replace("/api", "");
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await api.get("/certificates/");
      setCertificates(getListData(response));
    } catch {
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const generateCertificate = async (event) => {
    event.preventDefault();
    setGenerating(true);

    try {
      await api.post("/certificates/generate/", {
        ...form,
        score: Number(form.score)
      });

      toast.success("Certificate generated");
      loadCertificates();
    } catch {
      toast.error("Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  const getFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${backendBaseUrl}${url}`;
  };

  return (
    <div>
      <PageHeader
        badge="Certificate Generator"
        title="Generate dynamic PDF certificates with QR verification"
        description="Create downloadable certificates for tests, interviews, coding milestones, and career preparation achievements."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            <Award className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Generate Certificate
          </h2>

          <form onSubmit={generateCertificate} className="mt-6 space-y-5">
            <Input
              label="Certificate Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <Input
              label="Issued For"
              name="issued_for"
              value={form.issued_for}
              onChange={handleChange}
            />

            <Input
              label="Score"
              name="score"
              type="number"
              min="0"
              max="100"
              value={form.score}
              onChange={handleChange}
            />

            <Button type="submit" loading={generating} className="w-full">
              Generate Certificate
            </Button>
          </form>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          {loading ? (
            <Card>
              <p className="text-sm text-slate-400">Loading certificates...</p>
            </Card>
          ) : certificates.length === 0 ? (
            <EmptyState
              title="No certificates yet"
              description="Generate your first certificate after completing a module."
            />
          ) : (
            certificates.map((certificate) => (
              <Card key={certificate.id}>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                        <ShieldCheck className="h-7 w-7" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                          {certificate.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {certificate.issued_for}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Certificate ID
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
                          {certificate.certificate_id}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Score
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
                          {certificate.score}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-bold text-emerald-400">
                          Verified
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3">
                    {certificate.pdf_file && (
                      <a
                        href={getFileUrl(certificate.pdf_file)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button className="w-full">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </a>
                    )}

                    {certificate.qr_code && (
                      <a
                        href={getFileUrl(certificate.qr_code)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="secondary" className="w-full">
                          <QrCode className="h-4 w-4" />
                          QR
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

export default CertificatesPage;