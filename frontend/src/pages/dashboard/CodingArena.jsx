import { Code2, Crown, Play, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function getListData(response) {
  return response.data.results || response.data.data || response.data || [];
}

function CodingArena() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);

    try {
      const query = difficulty ? `?difficulty=${difficulty}` : "";
      const response = await api.get(`/coding/questions/${query}`);
      setQuestions(getListData(response));
    } catch {
      toast.error("Failed to load coding questions");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await api.get("/coding/submissions/leaderboard/");
      setLeaderboard(response.data.data || []);
    } catch {
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [difficulty]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const openQuestion = (question) => {
    setSelectedQuestion(question);
    setCode(question.starter_code || "");
  };

  const submitCode = async () => {
    if (!selectedQuestion) {
      toast.error("Select a question first");
      return;
    }

    if (code.trim().length < 20) {
      toast.error("Write a complete solution");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/coding/submissions/", {
        question: selectedQuestion.id,
        language,
        code
      });

      toast.success(`Submission: ${response.data.data.status}`);
      loadLeaderboard();
    } catch {
      toast.error("Failed to submit code");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Coding Arena"
        title="Practice coding problems and build logic"
        description="Solve coding questions, submit solutions, track accepted problems, and compete on the leaderboard."
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-6 xl:col-span-1">
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Problems
              </h2>
              <Code2 className="h-6 w-6 text-indigo-400" />
            </div>

            <Select
              label="Filter Difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-400">Loading questions...</p>
              ) : questions.length === 0 ? (
                <EmptyState
                  title="No questions"
                  description="Run python manage.py seed_data to add demo questions."
                />
              ) : (
                questions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => openQuestion(question)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedQuestion?.id === question.id
                        ? "border-indigo-400 bg-indigo-500/10"
                        : "border-slate-200 bg-white/70 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {question.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-indigo-400">
                      {question.difficulty} • {question.points} pts
                    </p>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
              <Trophy className="h-5 w-5 text-amber-400" />
              Leaderboard
            </h2>

            <div className="mt-5 space-y-3">
              {leaderboard.length === 0 ? (
                <p className="text-sm text-slate-400">No leaderboard data yet.</p>
              ) : (
                leaderboard.map((item) => (
                  <div
                    key={item.email}
                    className="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white">
                        {item.rank}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">
                          {item.full_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.target_role || "Student"}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-indigo-400">
                      {item.total_points}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!selectedQuestion ? (
            <EmptyState
              title="Select a coding problem"
              description="Choose a problem from the left side to view description, starter code, and submit your solution."
            />
          ) : (
            <Card>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {selectedQuestion.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Difficulty: {selectedQuestion.difficulty} • Points:{" "}
                    {selectedQuestion.points}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
                  <Crown className="h-4 w-4" />
                  Demo Judge
                </span>
              </div>

              <div className="mt-6 rounded-3xl bg-white/70 p-5 dark:bg-white/5">
                <h3 className="font-bold text-slate-950 dark:text-white">
                  Problem Description
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {selectedQuestion.description}
                </p>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/5">
                  <h3 className="font-bold text-slate-950 dark:text-white">
                    Sample Input
                  </h3>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-500 dark:text-slate-400">
                    {selectedQuestion.sample_input || "No sample input"}
                  </pre>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/5">
                  <h3 className="font-bold text-slate-950 dark:text-white">
                    Sample Output
                  </h3>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-500 dark:text-slate-400">
                    {selectedQuestion.sample_output || "No sample output"}
                  </pre>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <Select
                  label="Language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  containerClassName="md:col-span-1"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </Select>

                <div className="md:col-span-2" />
              </div>

              <Textarea
                label="Solution Code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="min-h-[320px] font-mono"
                containerClassName="mt-5"
              />

              <Button onClick={submitCode} loading={submitting} className="mt-5">
                <Play className="h-4 w-4" />
                Submit Solution
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodingArena;