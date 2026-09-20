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

        <button
          onClick={handleSaveMatch}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <RefreshCw
                size={18}
                className="animate-spin"
              />
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

      {/* Candidate + Job */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InfoCard
          icon={<User size={22} />}
          label="Candidate"
          value={result.candidate_name}
        />

        <InfoCard
          icon={<BriefcaseBusiness size={22} />}
          label="Job"
          value={result.job_title}
        />
      </div>

      {/* Final Score */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Overall Match Score
        </p>

        <div
          className={`mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full ${getScoreClass(
            result.final_match_score
          )}`}
        >
          <div>
            <p className="text-4xl font-bold">
              {result.final_match_score}%
            </p>

            <p className="mt-1 text-xs font-medium">
              Compatibility
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Score Breakdown
        </h2>

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
                  key={`${skill}-${index}`}
                  className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                >
                  {skill}
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
                  key={`${skill}-${index}`}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                >
                  {skill}
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
            <h2 className="font-bold text-slate-800">
              AI Match Analysis
            </h2>

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

      {/* Bottom */}
      <div className="flex justify-end">
        <Link
          to="/matching"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Sparkles size={17} />
          New Match
        </Link>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-800">
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

      <div className="mt-3 flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-800">
          {safeScore}
        </span>

        <span className="mb-1 text-sm text-slate-400">
          %
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