import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Search,
  RefreshCw,
  User,
  BriefcaseBusiness,
  ArrowRight,
  BarChart3,
} from "lucide-react";

import { getResumes } from "../../services/resumeApi";
import { getMatchHistory } from "../../services/matchApi";

function MatchHistory() {
  const [candidates, setCandidates] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [loadingCandidates, setLoadingCandidates] =
    useState(true);

  const [loadingHistory, setLoadingHistory] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoadingCandidates(true);

        const data = await getResumes();

        setCandidates(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Candidates history error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load candidates."
        );
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, []);

  const loadHistory = async (resumeId) => {
    if (!resumeId) {
      setHistory([]);
      return;
    }

    try {
      setLoadingHistory(true);
      setError("");

      const data = await getMatchHistory(resumeId);

      setHistory(
        Array.isArray(data?.history)
          ? data.history
          : []
      );
    } catch (err) {
      console.error(
        "Match history error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load match history."
      );

      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCandidateChange = (e) => {
    const resumeId = e.target.value;

    setSelectedResume(resumeId);

    loadHistory(resumeId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <History size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Match History
            </h1>

            <p className="text-sm text-slate-500">
              View previous job matching results
            </p>
          </div>
        </div>

        <Link
          to="/matching"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <BarChart3 size={18} />
          New Match
        </Link>
      </div>

      {/* Candidate Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Candidate
            </label>

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
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Candidate */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Select Candidate
            </label>

            <select
              value={selectedResume}
              onChange={handleCandidateChange}
              disabled={loadingCandidates}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            >
              <option value="">
                {loadingCandidates
                  ? "Loading candidates..."
                  : "Select a candidate"}
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
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loadingHistory && (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <RefreshCw
              size={30}
              className="mx-auto mb-3 animate-spin text-indigo-600"
            />

            <p className="text-sm text-slate-500">
              Loading match history...
            </p>
          </div>
        </div>
      )}

      {/* No candidate */}
      {!selectedResume &&
        !loadingHistory && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <User size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              Select a candidate
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a candidate to view their previous
              matching results.
            </p>
          </div>
        )}

      {/* Empty History */}
      {selectedResume &&
        !loadingHistory &&
        history.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <History size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No match history
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This candidate does not have any saved match
              results yet.
            </p>

            <Link
              to="/matching"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Start Matching
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

      {/* History */}
      {selectedResume &&
        !loadingHistory &&
        history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Previous Matches
                </h2>

                <p className="text-sm text-slate-500">
                  {history.length} saved match
                  {history.length !== 1 ? "es" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {history.map((match) => (
                <div
                  key={match.match_id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness
                          size={18}
                          className="text-indigo-600"
                        />

                        <h3 className="font-bold text-slate-800">
                          {match.job_title ||
                            "Unknown Job"}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {match.company ||
                          "Company not specified"}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl px-4 py-2 text-center ${getScoreClass(
                        match.final_match_score
                      )}`}
                    >
                      <p className="text-[10px] font-semibold uppercase">
                        Score
                      </p>

                      <p className="text-xl font-bold">
                        {match.final_match_score}%
                      </p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <MiniScore
                      label="Exact"
                      value={match.exact_skill_score}
                    />

                    <MiniScore
                      label="Semantic"
                      value={
                        match.semantic_skill_score
                      }
                    />

                    <MiniScore
                      label="Experience"
                      value={match.experience_score}
                    />
                  </div>

                  {/* Skills */}
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Matched Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(
                        match.matched_skills
                      ) &&
                      match.matched_skills.length > 0 ? (
                        match.matched_skills
                          .slice(0, 5)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700"
                            >
                              {skill}
                            </span>
                          ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No matched skills
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Match #{match.match_id}
                    </p>

                    <Link
                      to={`/matching/${match.job_id}/${match.resume_id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

function MiniScore({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-[10px] font-medium uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">
        {value ?? 0}%
      </p>
    </div>
  );
}

export default MatchHistory;