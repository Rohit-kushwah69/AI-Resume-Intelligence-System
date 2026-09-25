import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  XCircle,
  MessageSquare,
} from "lucide-react";

import { getResumeById } from "../../services/resumeApi";

function ResumeAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);

        const data = await getResumeById(id);

        setResume(data);
      } catch (error) {
        console.error("Failed to fetch resume:", error);

        setError(
          error.response?.data?.detail ||
            "Failed to load resume analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin text-indigo-600"
          />
          Loading AI analysis...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  const analysis = resume.ai_analysis || {};

  const score = Number(analysis.resume_score) || 0;

  const strengths = Array.isArray(analysis.strengths)
    ? analysis.strengths
    : [];

  const weaknesses = Array.isArray(analysis.weaknesses)
    ? analysis.weaknesses
    : [];

  const missingSkills = Array.isArray(analysis.missing_skills)
    ? analysis.missing_skills
    : [];

  const suggestions = Array.isArray(analysis.suggestions)
    ? analysis.suggestions
    : [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/resumes/${id}`)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              AI Resume Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered analysis for{" "}
              <span className="font-medium text-slate-700">
                {resume.name || "Candidate"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5">
            <Sparkles
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm font-semibold text-indigo-700">
              AI Analysis
            </span>
          </div>

          <button
            onClick={() => navigate(`/resume-chat/${id}`)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <MessageSquare size={17} />
            Chat with Resume
          </button>

        </div>
      </div>

      {/* Score + Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Target
              size={19}
              className="text-indigo-600"
            />

            <h2 className="font-semibold text-slate-700">
              Resume Score
            </h2>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-indigo-100">
              <div className="text-center">
                <p className="text-5xl font-bold text-indigo-600">
                  {score}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  out of 100
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm font-medium text-slate-600">
              AI-generated resume assessment
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles
              size={19}
              className="text-indigo-600"
            />

            <h2 className="font-semibold text-slate-700">
              AI Summary
            </h2>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-600">
              {analysis.summary ||
                "No AI summary is available for this resume."}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <InfoCard
              label="Candidate"
              value={resume.name || "Unknown"}
            />

            <InfoCard
              label="Skills Found"
              value={resume.skills?.length || 0}
            />
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Strengths */}
        <AnalysisCard
          title="Strengths"
          icon={CheckCircle}
          iconClass="text-emerald-600"
          bgClass="bg-emerald-50"
        >
          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    {formatItem(item)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText text="No strengths available." />
          )}
        </AnalysisCard>

        {/* Weaknesses */}
        <AnalysisCard
          title="Weaknesses"
          icon={AlertTriangle}
          iconClass="text-amber-600"
          bgClass="bg-amber-50"
        >
          {weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <AlertTriangle
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    {formatItem(item)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText text="No weaknesses available." />
          )}
        </AnalysisCard>
      </div>

      {/* Missing Skills */}
      <AnalysisCard
        title="Missing Skills"
        icon={XCircle}
        iconClass="text-red-600"
        bgClass="bg-red-50"
      >
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
              >
                {formatItem(skill)}
              </span>
            ))}
          </div>
        ) : (
          <EmptyText text="No missing skills identified." />
        )}
      </AnalysisCard>

      {/* Suggestions */}
      <AnalysisCard
        title="AI Suggestions"
        icon={Lightbulb}
        iconClass="text-indigo-600"
        bgClass="bg-indigo-50"
      >
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl bg-slate-50 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Lightbulb size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-indigo-600">
                    Recommendation {index + 1}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {formatItem(item)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyText text="No suggestions available." />
        )}
      </AnalysisCard>

      {/* AI Chat CTA */}
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Ask AI about this resume
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Ask questions about skills, experience, projects,
                education, certifications, and other resume details.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/resume-chat/${id}`)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <MessageSquare size={18} />
            Start AI Chat
          </button>

        </div>
      </div>


      {/* Bottom Action */}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          onClick={() => navigate(`/resumes/${id}`)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back to Resume
        </button>

        <button
          onClick={() => navigate(`/resume-chat/${id}`)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <MessageSquare size={17} />
          Chat with Resume
        </button>
      </div>
    </div>
  );
}

function AnalysisCard({
  title,
  icon: Icon,
  iconClass,
  bgClass,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgClass}`}
        >
          <Icon
            size={20}
            className={iconClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <p className="text-sm text-slate-400">
      {text}
    </p>
  );
}

function formatItem(item) {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    return (
      item.description ||
      item.name ||
      item.title ||
      item.skill ||
      JSON.stringify(item)
    );
  }

  return String(item);
}

export default ResumeAnalysis;