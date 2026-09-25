import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  User,
  RefreshCw,
  Save,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
  History,
  UserCircle2,
  Building2,
  CalendarDays,
  MessageSquare,
  Eye,
  ExternalLink,
} from "lucide-react";

import { matchResumeWithJob, saveJobMatch } from "../../services/matchApi";

function MatchDetails() {
  const { jobId, resumeId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const fetchMatch = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await matchResumeWithJob(
        jobId,
        resumeId
      );

      setResult(data);
    } catch (err) {
      console.error("Match details error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load match details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [jobId, resumeId]);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 4000);
  };

  const handleSaveMatch = async () => {
    try {
      setSaving(true);

      await saveJobMatch(jobId, resumeId);

      showNotification(
        "success",
        "Match result saved successfully!"
      );
    } catch (err) {
      console.error("Save match error:", err);

      showNotification(
        "error",
        err.response?.data?.detail ||
          "Failed to save match result."
      );
    } finally {
      setSaving(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) {
      return "bg-green-100 text-green-700";
    }

    if (score >= 60) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto mb-3 animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Analyzing match details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchMatch}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const matchedSkills = Array.isArray(result.matched_skills)
    ? result.matched_skills
    : [];

  const missingSkills = Array.isArray(result.missing_skills)
    ? result.missing_skills
    : [];

  const renderSkill = (skill) => {
    if (skill === null || skill === undefined) return "";
    if (typeof skill === "string" || typeof skill === "number") {
      return String(skill);
    }
    if (typeof skill === "object") {
      return String(skill.name || skill.skill || skill.title || Object.values(skill).find(
        (value) => typeof value === "string" || typeof value === "number"
      ) || "");
    }
    return String(skill);
  };

  const finalScore = Number(result.final_match_score) || 0;

  const scoreLabel =
    finalScore >= 80
      ? "Strong Match"
      : finalScore >= 60
        ? "Moderate Match"
        : "Low Match";

  const scoreDescription =
    finalScore >= 80
      ? "High compatibility based on the current matching signals."
      : finalScore >= 60
        ? "Several relevant signals match, with some gaps to review."
        : "There are significant gaps between the candidate and job requirements.";

  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;
  const totalSkillSignals = matchedCount + missingCount;
  const skillCoverage =
    totalSkillSignals > 0
      ? Math.round((matchedCount / totalSkillSignals) * 100)
      : 0;

  const createdAt = result.created_at
    ? new Date(result.created_at).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-start gap-3 rounded-xl border px-5 py-4 shadow-lg ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={22} />
          ) : (
            <XCircle size={22} />
          )}

          <div>
            <p className="font-semibold">
              {notification.type === "success"
                ? "Success"
                : "Error"}
            </p>

            <p className="mt-1 text-sm">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/matching")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm text-slate-400">
              Matching / Details
            </p>

            <h1 className="text-2xl font-bold text-slate-800">
              Match Analysis
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/resumes/${resumeId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={17} />
            Resume
          </Link>

          <button
            onClick={handleSaveMatch}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Candidate + Job */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Link to={`/resumes/${resumeId}`} className="block">
          <InfoCard
            icon={<User size={22} />}
            label="Candidate"
            value={result.candidate_name}
          />
        </Link>

        <Link to={`/jobs/${jobId}`} className="block">
          <InfoCard
            icon={<BriefcaseBusiness size={22} />}
            label="Job"
            value={result.job_title}
          />
        </Link>
      </div>

      {/* Match Snapshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Matched Skills
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {matchedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={19} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Missing Skills
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {missingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Target size={19} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Skill Coverage
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">
                {skillCoverage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Score */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="text-center lg:text-left">
            <p className="text-sm font-medium text-slate-500">
              Overall Match Score
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              {scoreLabel}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {scoreDescription}
            </p>

            {createdAt && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
                <CalendarDays size={14} />
                Analysis saved {createdAt}
              </div>
            )}
          </div>

          <div
            className={`flex h-36 w-36 shrink-0 items-center justify-center rounded-full ${getScoreClass(
              finalScore
            )}`}
          >
            <div className="text-center">
              <p className="text-4xl font-bold">
                {finalScore}%
              </p>
              <p className="mt-1 text-xs font-medium">
                Compatibility
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              Overall compatibility
            </span>
            <span className="font-semibold text-slate-700">
              {finalScore}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-700"
              style={{
                width: `${Math.min(Math.max(finalScore, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Score Breakdown
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Individual signals used to calculate the overall score
            </p>
          </div>
          <BarChart3 size={20} className="text-slate-400" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ScoreCard
            title="Exact Skill Match"
            score={result.exact_skill_score}
          />

          <ScoreCard
            title="Semantic Skill Match"
            score={result.semantic_skill_score}
          />

          <ScoreCard
            title="Experience Match"
            score={result.experience_score}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Matched */}
        <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Matched Skills
              </h2>

              <p className="text-xs text-slate-400">
                Skills found in the candidate profile
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, index) => (
                <span
                  key={`${renderSkill(skill)}-${index}`}
                  className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                >
                  {renderSkill(skill)}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No matched skills.
              </p>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Missing Skills
              </h2>

              <p className="text-xs text-slate-400">
                Skills required by the job but not found
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <span
                  key={`${renderSkill(skill)}-${index}`}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                >
                  {renderSkill(skill)}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No missing skills.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800">
                AI Match Analysis
              </h2>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                AI
              </span>
            </div>

            <p className="text-xs text-slate-500">
              AI-generated analysis of candidate compatibility
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-5">
          {typeof result.ai_analysis === "string" ? (
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {result.ai_analysis}
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                result.ai_analysis || {}
              ).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-semibold capitalize text-slate-800">
                    {key.replaceAll("_", " ")}
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-800">Recruiter Actions</h2>
          <p className="mt-1 text-xs text-slate-400">
            Continue reviewing this candidate or run another match.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to={`/resumes/${resumeId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={17} />
            View Resume
          </Link>

          <Link
            to={`/resume-chat/${resumeId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <MessageSquare size={17} />
            Chat with Resume
          </Link>

          <Link
            to={`/jobs/${jobId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={17} />
            View Job
          </Link>

          <Link
            to="/matching/history"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <History size={17} />
            Match History
          </Link>

          <button
            type="button"
            onClick={fetchMatch}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Re-run Match
          </button>

          <Link
            to="/matching"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Sparkles size={17} />
            New Match
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate font-semibold text-slate-800">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

function ScoreCard({ title, score }) {
  const safeScore = Number(score) || 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <span className="text-3xl font-bold text-slate-800">
            {safeScore}
          </span>
          <span className="mb-1 ml-1 text-sm text-slate-400">
            %
          </span>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            safeScore >= 80
              ? "bg-green-50 text-green-700"
              : safeScore >= 60
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {safeScore >= 80
            ? "Strong"
            : safeScore >= 60
              ? "Moderate"
              : "Low"}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{
            width: `${Math.min(
              Math.max(safeScore, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

export default MatchDetails;