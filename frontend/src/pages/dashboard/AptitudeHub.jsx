import { Brain, CheckCircle2, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";

function getListData(response) {
  return response.data.results || response.data.data || response.data || [];
}

function AptitudeHub() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadTests = async () => {
    try {
      const response = await api.get("/aptitude/tests/");
      setTests(getListData(response));
    } catch {
      toast.error("Failed to load aptitude tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const chooseTest = (test) => {
    setSelectedTest(test);
    setAnswers({});
    setResult(null);
  };

  const submitTest = async () => {
    if (!selectedTest) return;

    if (Object.keys(answers).length === 0) {
      toast.error("Please answer at least one question");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/aptitude/tests/${selectedTest.id}/submit/`, {
        answers
      });

      setResult(response.data.data);
      toast.success("Aptitude test submitted");
    } catch {
      toast.error("Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Aptitude Practice Hub"
        title="Practice timed placement aptitude tests"
        description="Take MCQ tests, get automatic evaluation, and track your placement preparation performance."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <Target className="h-5 w-5 text-indigo-400" />
            Available Tests
          </h2>

          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading tests...</p>
            ) : tests.length === 0 ? (
              <EmptyState
                title="No tests found"
                description="Run python manage.py seed_data to add demo aptitude tests."
              />
            ) : (
              tests.map((test) => (
                <button
                  key={test.id}
                  onClick={() => chooseTest(test)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedTest?.id === test.id
                      ? "border-indigo-400 bg-indigo-500/10"
                      : "border-slate-200 bg-white/70 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {test.title}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {test.duration_minutes} minutes • {test.questions?.length || 0} questions
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          {!selectedTest ? (
            <EmptyState
              title="Select an aptitude test"
              description="Choose a test to start answering MCQs."
            />
          ) : (
            <Card>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {selectedTest.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {selectedTest.description || "Practice test"}
                  </p>
                </div>

                <div className="rounded-2xl bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-300">
                  {selectedTest.duration_minutes} min
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {selectedTest.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
                  >
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {questionIndex + 1}. {question.question_text}
                    </h3>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: optionIndex
                            }))
                          }
                          className={`rounded-2xl border p-4 text-left text-sm transition ${
                            answers[question.id] === optionIndex
                              ? "border-indigo-400 bg-indigo-500/10 text-indigo-300"
                              : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!result && (
                <Button onClick={submitTest} loading={submitting} className="mt-6">
                  Submit Test
                </Button>
              )}

              {result && (
                <div className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    <div>
                      <h3 className="text-xl font-bold text-emerald-300">
                        Test Completed
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-300">
                        Your result has been saved.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Score
                      </p>
                      <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                        {result.score}/{result.total_marks}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Correct
                      </p>
                      <p className="mt-1 text-3xl font-black text-emerald-400">
                        {result.correct_count}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Wrong
                      </p>
                      <p className="mt-1 text-3xl font-black text-rose-400">
                        {result.wrong_count}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default AptitudeHub;