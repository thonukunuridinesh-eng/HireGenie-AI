import { Bot, CheckCircle2, MessageSquareText, Mic, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

function MockInterview() {
  const [loading, setLoading] = useState(false);
  const [answeringId, setAnsweringId] = useState(null);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});

  const [form, setForm] = useState({
    interview_type: "mixed",
    target_role: "Python Full Stack Developer",
    difficulty: "medium"
  });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const startInterview = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/interviews/start/", form);
      setSession(response.data.data);
      toast.success("Mock interview started");
    } catch {
      toast.error("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId) => {
    const answer = answers[questionId];

    if (!answer || answer.trim().length < 10) {
      toast.error("Please write a proper answer");
      return;
    }

    setAnsweringId(questionId);

    try {
      const response = await api.post(`/interviews/${session.id}/submit_answer/`, {
        question_id: questionId,
        answer
      });

      setSession(response.data.data);
      toast.success("Answer evaluated by AI");
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setAnsweringId(null);
    }
  };

  const completeInterview = async () => {
    try {
      const response = await api.post(`/interviews/${session.id}/complete/`);
      setSession(response.data.data);
      toast.success("Interview completed");
    } catch {
      toast.error("Failed to complete interview");
    }
  };

  return (
    <div>
      <PageHeader
        badge="AI Mock Interview"
        title="Practice HR and technical interviews"
        description="Generate interview questions, write answers, receive AI feedback, and track your score."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            <Mic className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Start Interview
          </h2>

          <form onSubmit={startInterview} className="mt-6 space-y-5">
            <Select
              label="Interview Type"
              name="interview_type"
              value={form.interview_type}
              onChange={handleChange}
            >
              <option value="hr">HR Interview</option>
              <option value="technical">Technical Interview</option>
              <option value="mixed">Mixed Interview</option>
            </Select>

            <Input
              label="Target Role"
              name="target_role"
              value={form.target_role}
              onChange={handleChange}
            />

            <Select
              label="Difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>

            <Button type="submit" loading={loading} className="w-full">
              Generate Questions
            </Button>
          </form>

          {session && (
            <div className="mt-6 rounded-3xl bg-white/5 p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current Score
              </p>
              <p className="mt-2 text-5xl font-black text-slate-950 dark:text-white">
                {session.score}%
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-indigo-400">
                Status: {session.status}
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-5 lg:col-span-2">
          {!session ? (
            <Card className="text-center">
              <Bot className="mx-auto h-12 w-12 text-indigo-300" />
              <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                Your AI interviewer is ready
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Choose interview type and target role to generate personalized
                questions.
              </p>
            </Card>
          ) : (
            <>
              {session.questions.map((question, index) => (
                <Card key={question.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                        {question.question}
                      </h3>

                      <Textarea
                        label="Your Answer"
                        placeholder="Write your answer here..."
                        value={answers[question.id] || question.answer || ""}
                        onChange={(event) =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: event.target.value
                          }))
                        }
                        containerClassName="mt-5"
                      />

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          onClick={() => submitAnswer(question.id)}
                          loading={answeringId === question.id}
                        >
                          <Send className="h-4 w-4" />
                          Submit Answer
                        </Button>

                        {question.answer && (
                          <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Evaluated: {question.score}%
                          </span>
                        )}
                      </div>

                      {question.ai_feedback && (
                        <div className="mt-5 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5">
                          <p className="flex items-center gap-2 font-semibold text-indigo-300">
                            <MessageSquareText className="h-5 w-5" />
                            AI Feedback
                          </p>

                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-500 dark:text-slate-300">
                            {question.ai_feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {session.status !== "completed" && (
                <Button onClick={completeInterview} className="w-full">
                  Complete Interview
                </Button>
              )}

              {session.status === "completed" && (
                <Card className="border-emerald-400/30 bg-emerald-500/10">
                  <h3 className="text-xl font-bold text-emerald-300">
                    Interview Completed
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
                    {session.overall_feedback}
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockInterview;