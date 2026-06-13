import { Map, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

function CareerRoadmap() {
  const [careerGoal, setCareerGoal] = useState("Python Developer");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async (event) => {
    event.preventDefault();

    if (!careerGoal.trim()) {
      toast.error("Enter a career goal");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/roadmaps/generate/", {
        career_goal: careerGoal
      });

      setRoadmap(response.data.data);
      toast.success("Career roadmap generated");
    } catch {
      toast.error("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const renderList = (title, items) => (
    <Card>
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>

      <div className="mt-5 space-y-3">
        {(items || []).map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-2xl bg-white/70 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div>
      <PageHeader
        badge="Career Roadmap Generator"
        title="Generate a personalized weekly learning roadmap"
        description="Choose a career goal and let AI create skills, projects, certifications, interview plan, and weekly tasks."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            <Map className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Your Career Goal
          </h2>

          <form onSubmit={generateRoadmap} className="mt-6 space-y-5">
            <Input
              label="Career Goal"
              value={careerGoal}
              onChange={(event) => setCareerGoal(event.target.value)}
              placeholder="Python Developer"
            />

            <Button type="submit" loading={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              Generate Roadmap
            </Button>
          </form>

          <div className="mt-6 rounded-3xl bg-white/5 p-5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              Example goals:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Python Developer",
                "Full Stack Developer",
                "Data Analyst",
                "React Developer"
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setCareerGoal(goal)}
                  className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          {!roadmap ? (
            <Card className="text-center">
              <Rocket className="mx-auto h-14 w-14 text-indigo-300" />
              <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                Your roadmap will appear here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Generate a roadmap to get a clear learning path for your target
                role.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-indigo-400/30 bg-indigo-500/10">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {roadmap.career_goal}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
                  {roadmap.ai_summary}
                </p>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {renderList("Skills to Learn", roadmap.skills_to_learn)}
                {renderList("Projects to Build", roadmap.projects_to_build)}
                {renderList("Certifications", roadmap.certifications)}
                {renderList(
                  "Interview Preparation",
                  roadmap.interview_preparation_plan
                )}
              </div>

              <Card>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Weekly Learning Roadmap
                </h3>

                <div className="mt-6 space-y-5">
                  {(roadmap.weekly_learning_roadmap || []).map((week, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                        Week {week.week || index + 1}
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                        {week.focus}
                      </h4>

                      <ul className="mt-4 space-y-2">
                        {(week.tasks || []).map((task, taskIndex) => (
                          <li
                            key={taskIndex}
                            className="text-sm text-slate-500 dark:text-slate-400"
                          >
                            • {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerRoadmap;