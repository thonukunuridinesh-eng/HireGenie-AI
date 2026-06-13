import { Download, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import Textarea from "../../components/ui/Textarea";
import { useAuth } from "../../context/AuthContext";

function ResumeBuilder() {
  const { profile, user } = useAuth();

  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    title: profile?.headline || "Python Full Stack Developer",
    summary:
      "Motivated Python Full Stack student skilled in Django, React, REST APIs, PostgreSQL, and modern web development.",
    skills: "Python, Django, Django REST Framework, React, JavaScript, Tailwind CSS, PostgreSQL, Git, REST API",
    education: "B.Tech in Computer Science and Engineering",
    experience: "Fresher / Internship-ready candidate",
    certifications: "Python Full Stack Development, Django REST API"
  });

  const [projects, setProjects] = useState([
    {
      name: "HireGenie AI – AI Career Assistant Platform",
      tech: "Python, Django REST Framework, React, PostgreSQL, Tailwind CSS",
      description:
        "Built a full-stack AI career assistant platform with resume analyzer, ATS scoring, mock interview, coding arena, aptitude tests, job recommendations, and certificates."
    }
  ]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setProjects((current) =>
      current.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project
      )
    );
  };

  const addProject = () => {
    setProjects((current) => [
      ...current,
      {
        name: "",
        tech: "",
        description: ""
      }
    ]);
  };

  const removeProject = (index) => {
    setProjects((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handlePrint = () => {
    toast.success("Use browser Save as PDF option");
    setTimeout(() => window.print(), 400);
  };

  return (
    <div>
      <PageHeader
        badge="Resume Builder"
        title="Create a premium ATS-friendly resume"
        description="Fill your details, add projects, preview instantly, and export using browser Save as PDF."
        action={
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6 print:hidden">
          <Card>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Personal Details
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />

              <Input
                label="Professional Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                containerClassName="md:col-span-2"
              />
            </div>

            <Textarea
              label="Professional Summary"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              containerClassName="mt-5"
            />
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Skills, Education, Experience
            </h2>

            <div className="mt-6 space-y-5">
              <Textarea
                label="Skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
              />

              <Textarea
                label="Education"
                name="education"
                value={form.education}
                onChange={handleChange}
              />

              <Textarea
                label="Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />

              <Textarea
                label="Certifications"
                name="certifications"
                value={form.certifications}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Projects
              </h2>

              <Button onClick={addProject}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="mt-6 space-y-5">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-950 dark:text-white">
                      Project {index + 1}
                    </p>

                    {projects.length > 1 && (
                      <button
                        onClick={() => removeProject(index)}
                        className="rounded-xl bg-rose-500/10 p-2 text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Project Name"
                      value={project.name}
                      onChange={(event) =>
                        handleProjectChange(index, "name", event.target.value)
                      }
                    />

                    <Input
                      label="Tech Stack"
                      value={project.tech}
                      onChange={(event) =>
                        handleProjectChange(index, "tech", event.target.value)
                      }
                    />

                    <Textarea
                      label="Description"
                      value={project.description}
                      onChange={(event) =>
                        handleProjectChange(index, "description", event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-white text-slate-950 dark:bg-white dark:text-slate-950 print:shadow-none">
          <div id="resume-preview" className="mx-auto max-w-3xl">
            <div className="border-b-4 border-indigo-600 pb-5">
              <h1 className="text-4xl font-black uppercase tracking-tight">
                {form.fullName || "Your Name"}
              </h1>

              <p className="mt-2 text-lg font-semibold text-indigo-700">
                {form.title}
              </p>

              <p className="mt-3 text-sm text-slate-600">
                {form.email} {form.phone && `| ${form.phone}`}{" "}
                {form.location && `| ${form.location}`}
              </p>
            </div>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Summary
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.summary}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Skills
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.skills}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Projects
              </h2>

              <div className="mt-3 space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-slate-950">
                      {project.name || "Project Name"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      Tech: {project.tech}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Education
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.education}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Experience
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.experience}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700">
                Certifications
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.certifications}
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ResumeBuilder;