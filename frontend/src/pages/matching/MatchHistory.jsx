import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  History,
  Search,
  RefreshCw,
  Eye,
  Briefcase,
  User,
  CalendarDays,
  Target,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import { getResumes } from "../../services/resumeApi";
import { getMatchHistory } from "../../services/matchApi";

function MatchHistory() {
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedResume, setSelectedResume] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const resumeData = await getResumes();

      const resumeList = Array.isArray(resumeData)
        ? resumeData
        : [];

      setResumes(resumeList);

      if (resumeList.length === 0) {
        setMatches([]);
        return;
      }

      let history = [];

      if (selectedResume === "all") {
        const results = await Promise.all(
          resumeList.map(async (resume) => {
            try {
              const response = await getMatchHistory(
                resume.id
              );

              return response?.history || [];
            } catch (err) {
              console.error(
                `History error for resume ${resume.id}:`,
                err
              );

              return [];
            }
          })
        );

        history = results.flat();
      } else {
        const response = await getMatchHistory(
          selectedResume
        );

        history = response?.history || [];
      }

      setMatches(history);
    } catch (err) {
      console.error("Match history error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load match history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedResume]);

  const filteredMatches = matches.filter((match) => {
    const searchText = search.toLowerCase();

    return (
      match.job_title
        ?.toLowerCase()
        .includes(searchText) ||
      match.company
        ?.toLowerCase()
        .includes(searchText) ||
      String(match.resume_id)
        .toLowerCase()
        .includes(searchText)
    );
  });

  const getScoreStyle = (score) => {
    const value = Number(score || 0);

    if (value >= 80) {
      return "bg-green-50 text-green-600";
    }

    if (value >= 60) {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <History size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Match History
            </h1>

            <p className="text-sm text-slate-500">
              View previously saved resume-job matches
            </p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
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

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search job, company or candidate..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Candidate Filter */}
          <select
            value={selectedResume}
            onChange={(e) =>
              setSelectedResume(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              All Candidates
            </option>

            {resumes.map((resume) => (
              <option
                key={resume.id}
                value={resume.id}
              >
                {resume.name ||
                  `Candidate #${resume.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <RefreshCw
              size={34}
              className="mx-auto mb-3 animate-spin text-indigo-600"
            />

            <p className="text-sm text-slate-500">
              Loading match history...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchHistory}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredMatches.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <History size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              {search
                ? "No matching history found"
                : "No saved matches yet"}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Save a resume-job match to see it here."}
            </p>
          </div>
        )}

      {/* Match Cards */}
      {!loading &&
        !error &&
        filteredMatches.length > 0 && (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match.match_id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Top */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Briefcase size={21} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {match.job_title ||
                          "Unknown Job"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {match.company ||
                          "Company not specified"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <User size={13} />
                          Resume #{match.resume_id}
                        </span>

                        {match.created_at && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {new Date(
                              match.created_at
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div
                    className={`rounded-xl px-5 py-3 text-center ${getScoreStyle(
                      match.final_match_score
                    )}`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide">
                      Match Score
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {Math.round(
                        Number(
                          match.final_match_score || 0
                        )
                      )}
                      %
                    </p>
                  </div>
                </div>

                {/* Scores */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={17}
                        className="text-indigo-600"
                      />

                      <p className="text-xs text-slate-400">
                        Exact Skills
                      </p>
                    </div>

                    <p className="mt-2 text-lg font-bold text-slate-800">
                      {Math.round(
                        Number(
                          match.exact_skill_score || 0
                        )
                      )}
                      %
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <BrainCircuit
                        size={17}
                        className="text-indigo-600"
                      />

                      <p className="text-xs text-slate-400">
                        Semantic Match
                      </p>
                    </div>

                    <p className="mt-2 text-lg font-bold text-slate-800">
                      {Math.round(
                        Number(
                          match.semantic_skill_score ||
                            0
                        )
                      )}
                      %
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <Target
                        size={17}
                        className="text-indigo-600"
                      />

                      <p className="text-xs text-slate-400">
                        Experience
                      </p>
                    </div>

                    <p className="mt-2 text-lg font-bold text-slate-800">
                      {Math.round(
                        Number(
                          match.experience_score || 0
                        )
                      )}
                      %
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Matched Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(
                        match.matched_skills
                      ) &&
                      match.matched_skills.length > 0 ? (
                        match.matched_skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-600"
                            >
                              {typeof skill ===
                              "object"
                                ? JSON.stringify(skill)
                                : String(skill)}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-slate-400">
                          No matched skills
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Missing Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(
                        match.missing_skills
                      ) &&
                      match.missing_skills.length > 0 ? (
                        match.missing_skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600"
                            >
                              {typeof skill ===
                              "object"
                                ? JSON.stringify(skill)
                                : String(skill)}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-slate-400">
                          No missing skills
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                  <Link
                    to={`/matching/${match.job_id}/${match.resume_id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Eye size={17} />
                    View Match Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default MatchHistory;