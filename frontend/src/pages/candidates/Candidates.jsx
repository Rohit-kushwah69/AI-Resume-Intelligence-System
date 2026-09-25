import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Eye,
  BrainCircuit,
  FileText,
  MessageSquare,
  GraduationCap,
  Briefcase,
  Award,
  SlidersHorizontal,
} from "lucide-react";

import { getResumes } from "../../services/resumeApi";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH CANDIDATES
  // ==============================

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();

      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Candidates fetch error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD ON PAGE OPEN
  // ==============================

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  const filteredCandidates = candidates.filter((candidate) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchText) ||
      candidate.email?.toLowerCase().includes(searchText) ||
      candidate.phone?.toLowerCase().includes(searchText);

    const score = Number(candidate.ai_analysis?.resume_score || 0);

    const matchesScore =
      scoreFilter === "all" ||
      (scoreFilter === "80" && score >= 80) ||
      (scoreFilter === "60" && score >= 60 && score < 80) ||
      (scoreFilter === "below60" && score < 60);

    return matchesSearch && matchesScore;
  });

  const averageScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce(
            (total, candidate) =>
              total + Number(candidate.ai_analysis?.resume_score || 0),
            0
          ) / candidates.length
        )
      : 0;

  const analyzedCandidates = candidates.filter(
    (candidate) => Number(candidate.ai_analysis?.resume_score || 0) > 0
  ).length;

  // ==============================
  // RESUME SCORE
  // ==============================

  const getScore = (candidate) => {
    return candidate.ai_analysis?.resume_score ?? 0;
  };

  // ==============================
  // SKILLS
  // ==============================

  const getSkills = (candidate) => {
    if (Array.isArray(candidate.skills)) {
      return candidate.skills;
    }

    if (typeof candidate.skills === "string") {
      try {
        return JSON.parse(candidate.skills);
      } catch {
        return [];
      }
    }

    return [];
  };

  const getScoreStyle = (score) => {
    const value = Number(score || 0);

    if (value >= 80) {
      return "bg-green-50 text-green-600 border-green-100";
    }

    if (value >= 60) {
      return "bg-yellow-50 text-yellow-600 border-yellow-100";
    }

    return "bg-red-50 text-red-600 border-red-100";
  };

  const getExperience = (candidate) => {
    if (!candidate.experience) return "Experience not available";

    if (typeof candidate.experience === "string") {
      return candidate.experience.length > 100
        ? `${candidate.experience.slice(0, 100)}...`
        : candidate.experience;
    }

    return "Experience available";
  };

  const getEducation = (candidate) => {
    if (!candidate.education) return "Education not available";

    if (typeof candidate.education === "string") {
      return candidate.education.length > 80
        ? `${candidate.education.slice(0, 80)}...`
        : candidate.education;
    }

    return "Education available";
  };

  return (
    <div className="space-y-6">

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Users size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Candidates
            </h1>

            <p className="text-sm text-slate-500">
              Manage and review uploaded candidates
            </p>
          </div>

        </div>

        <Link
          to="/resumes/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <FileText size={18} />
          Upload Resume
        </Link>

      </div>

      {/* ============================== */}
      {/* SEARCH */}
      {/* ============================== */}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto]">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search candidates by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        <div className="relative">
          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="h-full min-w-[190px] rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All Scores</option>
            <option value="80">80% and above</option>
            <option value="60">60% - 79%</option>
            <option value="below60">Below 60%</option>
          </select>
        </div>

        <button
          onClick={fetchCandidates}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* ============================== */}
      {/* CANDIDATE STATS */}
      {/* ============================== */}

      {!loading && !error && candidates.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Candidates
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {candidates.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Uploaded resumes
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Average Resume Score
            </p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {averageScore}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across all candidates
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI Analyzed
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {analyzedCandidates}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Candidates with AI score
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Showing
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {filteredCandidates.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              After current filters
            </p>
          </div>
        </div>
      )}


      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

          <div className="text-center">

            <RefreshCw
              size={32}
              className="mx-auto mb-3 animate-spin text-indigo-600"
            />

            <p className="text-sm text-slate-500">
              Loading candidates...
            </p>

          </div>

        </div>
      )}

      {/* ============================== */}
      {/* ERROR */}
      {/* ============================== */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchCandidates}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>
      )}

      {/* ============================== */}
      {/* EMPTY */}
      {/* ============================== */}

      {!loading &&
        !error &&
        filteredCandidates.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Users size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              {search
                ? "No candidates found"
                : "No candidates available"}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different name, email or phone number."
                : "Upload resumes to start building your candidate pool."}
            </p>

            {!search && (
              <Link
                to="/resumes/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <FileText size={18} />
                Upload Resume
              </Link>
            )}

          </div>
        )}

      {/* ============================== */}
      {/* CANDIDATES */}
      {/* ============================== */}

      {!loading &&
        !error &&
        filteredCandidates.length > 0 && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {filteredCandidates.map((candidate) => {
              const skills = getSkills(candidate);
              const score = getScore(candidate);

              return (
                <div
                  key={candidate.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                        {candidate.name
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                          {candidate.name || "Unknown Candidate"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          Candidate #{candidate.id}
                        </p>
                      </div>

                    </div>

                    {/* Resume Score */}
                    <div className={`rounded-xl border px-3 py-2 text-center ${getScoreStyle(score)}`}>

                      <p className="text-[10px] font-semibold uppercase tracking-wide">
                        AI Score
                      </p>

                      <p className="text-lg font-bold">
                        {score}%
                      </p>

                    </div>

                  </div>

                  {/* Contact */}
                  <div className="mt-5 space-y-2">

                    {candidate.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Mail size={16} />

                        <span className="truncate">
                          {candidate.email}
                        </span>

                      </div>
                    )}

                    {candidate.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">

                        <Phone size={16} />

                        <span>
                          {candidate.phone}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* Profile Information */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Briefcase size={15} />
                        Experience
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {getExperience(candidate)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <GraduationCap size={15} />
                        Education
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {getEducation(candidate)}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5">

                    <div className="mb-2 flex items-center justify-between">

                      <p className="text-sm font-semibold text-slate-700">
                        Skills
                      </p>

                      <span className="text-xs text-slate-400">
                        {skills.length} skills
                      </span>

                    </div>

                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">

                        {skills.slice(0, 6).map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}

                        {skills.length > 6 && (
                          <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600">
                            +{skills.length - 6} more
                          </span>
                        )}

                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No skills available.
                      </p>
                    )}

                  </div>

                  {/* ============================== */}
                  {/* ACTIONS */}
                  {/* ============================== */}

                  <div className="mt-6 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3">

                    <Link
                      to={`/candidates/${candidate.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye size={16} />
                      Profile
                    </Link>

                    <Link
                      to={`/resumes/${candidate.id}/analysis`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <BrainCircuit size={16} />
                      AI Analysis
                    </Link>

                    <Link
                      to={`/resume-chat/${candidate.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      <MessageSquare size={16} />
                      AI Chat
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}

export default Candidates;