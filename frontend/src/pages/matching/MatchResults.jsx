import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  BriefcaseBusiness,
  Users,
  Search,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { getJobs } from "../../services/jobApi";
import { getResumes } from "../../services/resumeApi";
import { matchResumeWithJob } from "../../services/matchApi";

function MatchResults() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [selectedJob, setSelectedJob] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");

  const [result, setResult] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsData, resumesData] = await Promise.all([
        getJobs(),
        getResumes(),
      ]);

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCandidates(
        Array.isArray(resumesData) ? resumesData : []
      );
    } catch (err) {
      console.error("Matching data error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load jobs and candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMatch = async () => {
    if (!selectedJob || !selectedCandidate) {
      setMatchError(
        "Please select both a job and a candidate."
      );
      return;
    }

    try {
      setMatching(true);
      setMatchError("");
      setResult(null);

      const data = await matchResumeWithJob(
        selectedJob,
        selectedCandidate
      );

      setResult(data);
    } catch (err) {
      console.error("Matching error:", err);

      setMatchError(
        err.response?.data?.detail ||
          "Failed to match candidate with job."
      );
    } finally {
      setMatching(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) => {
      const searchText = search.toLowerCase();

      return (
        candidate.name
          ?.toLowerCase()
          .includes(searchText) ||
        candidate.email
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

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
            Loading matching data...
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
            onClick={fetchData}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <BrainCircuit size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Resume Matching
            </h1>

            <p className="text-sm text-slate-500">
              Match candidates with jobs using AI-powered
              analysis
            </p>
          </div>
        </div>
      </div>

      {/* Selection Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Start Matching
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a job and candidate to calculate the
            compatibility score.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Job */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BriefcaseBusiness size={17} />
              Select Job
            </label>

            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                setResult(null);
                setMatchError("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select a job
              </option>

              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title}
                  {job.company
                    ? ` - ${job.company}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users size={17} />
              Select Candidate
            </label>

            <select
              value={selectedCandidate}
              onChange={(e) => {
                setSelectedCandidate(e.target.value);
                setResult(null);
                setMatchError("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select a candidate
              </option>

              {filteredCandidates.map(
                (candidate) => (
                  <option
                    key={candidate.id}
                    value={candidate.id}
                  >
                    {candidate.name ||
                      `Candidate #${candidate.id}`}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Candidate Search */}
        <div className="mt-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search candidate by name or email..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Match Error */}
        {matchError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {matchError}
          </div>
        )}

        {/* Match Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleMatch}
            disabled={matching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {matching ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Analyzing Candidate...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Match Candidate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Match Result
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {result.candidate_name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {result.job_title}
                </p>
              </div>

              <div
                className={`rounded-2xl px-6 py-4 text-center ${getScoreClass(
                  result.final_match_score
                )}`}
              >
                <p className="text-xs font-semibold uppercase">
                  Match Score
                </p>

                <p className="mt-1 text-4xl font-bold">
                  {result.final_match_score}%
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
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

          {/* Skills */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkillCard
              title="Matched Skills"
              skills={result.matched_skills}
              type="matched"
            />

            <SkillCard
              title="Missing Skills"
              skills={result.missing_skills}
              type="missing"
            />
          </div>

          {/* AI Analysis */}
          {result.ai_analysis && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    AI Match Analysis
                  </h2>

                  <p className="text-xs text-slate-500">
                    AI-generated candidate-job analysis
                  </p>
                </div>
              </div>

              <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {typeof result.ai_analysis ===
                "string"
                  ? result.ai_analysis
                  : JSON.stringify(
                      result.ai_analysis,
                      null,
                      2
                    )}
              </div>
            </div>
          )}

          {/* Details Button */}
          <div className="flex justify-end">
            <Link
              to={`/matching/${result.job_id}/${result.resume_id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              View Detailed Match
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-800">
          {score ?? 0}
        </span>

        <span className="mb-1 text-sm text-slate-400">
          %
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{
            width: `${Math.min(
              Math.max(score ?? 0, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function SkillCard({ title, skills, type }) {
  const list = Array.isArray(skills) ? skills : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">
        {title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {list.length > 0 ? (
          list.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                type === "matched"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No skills available.
          </p>
        )}
      </div>
    </div>
  );
}

export default MatchResults;