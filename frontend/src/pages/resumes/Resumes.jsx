import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Eye,
  Sparkles,
  RefreshCw,
  Trash2,
  MessageSquare,
  Briefcase,
  Filter,
  Plus,
  Users,
} from "lucide-react";

import {
  getResumes,
  deleteResume,
} from "../../services/resumeApi";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [scoreFilter, setScoreFilter] = useState("all");
  const navigate = useNavigate();

  // ==========================================
  // FETCH RESUMES
  // ==========================================

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();

      setResumes(data);
    } catch (error) {
      console.error(
        "Failed to fetch resumes:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE RESUME
  // ==========================================

  const handleDeleteResume = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        name || "this resume"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteResume(id);

      // Remove from UI immediately
      setResumes((prev) =>
        prev.filter(
          (resume) => resume.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to delete resume."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchResumes();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const getScore = (resume) =>
    Number(resume.ai_analysis?.resume_score ?? resume.resume_score ?? 0);

  const filteredResumes = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return resumes.filter((resume) => {
      const matchesSearch =
        !searchText ||
        resume.name?.toLowerCase().includes(searchText) ||
        resume.email?.toLowerCase().includes(searchText) ||
        resume.phone?.toLowerCase().includes(searchText);

      const score = getScore(resume);
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "high" && score >= 80) ||
        (scoreFilter === "medium" && score >= 60 && score < 80) ||
        (scoreFilter === "low" && score > 0 && score < 60) ||
        (scoreFilter === "not_scored" && score === 0);

      return matchesSearch && matchesScore;
    });
  }, [resumes, search, scoreFilter]);

  const stats = useMemo(() => {
    const scored = resumes.filter((resume) => getScore(resume) > 0);
    const average =
      scored.length > 0
        ? Math.round(
            scored.reduce((sum, resume) => sum + getScore(resume), 0) /
              scored.length
          )
        : 0;

    return {
      total: resumes.length,
      analyzed: scored.length,
      average,
      high: resumes.filter((resume) => getScore(resume) >= 80).length,
    };
  }, [resumes]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Resumes</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage, analyze and match candidate resumes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchResumes}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/resumes/upload")}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Upload Resume
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Resumes" value={stats.total} />
        <StatCard icon={Sparkles} label="AI Analyzed" value={stats.analyzed} />
        <StatCard
          icon={FileText}
          label="Average Score"
          value={stats.average ? `${stats.average}%` : "--"}
        />
        <StatCard icon={Briefcase} label="Strong Profiles" value={stats.high} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div className="relative lg:w-56">
            <Filter
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-600 outline-none focus:border-indigo-400"
            >
              <option value="all">All Scores</option>
              <option value="high">80+ Strong</option>
              <option value="medium">60–79 Moderate</option>
              <option value="low">1–59 Needs Review</option>
              <option value="not_scored">Not Scored</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <b className="text-slate-600">{filteredResumes.length}</b> of{" "}
            <b className="text-slate-600">{resumes.length}</b> resumes
          </span>
          {(search || scoreFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setScoreFilter("all");
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center gap-3 text-sm text-slate-500">

            <RefreshCw
              size={20}
              className="animate-spin text-indigo-600"
            />

            Loading resumes...

          </div>

        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">

          {error}

        </div>
      )}

      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        !error &&
        filteredResumes.length === 0 && (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <FileText
              size={40}
              className="text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              No resumes found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Upload a resume to see it here.
            </p>

          </div>
        )}

      {/* ======================================
          RESUME GRID
      ====================================== */}

      {!loading &&
        !error &&
        filteredResumes.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {filteredResumes.map(
              (resume) => (
                <div
                  key={resume.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* ==================================
                      TOP SECTION
                  ================================== */}

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                        <FileText size={22} />

                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-800">
                          {resume.name ||
                            "Unknown Candidate"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {resume.email ||
                            "No email available"}
                        </p>

                      </div>

                    </div>

                    {/* SCORE */}

                    <div className="text-right">

                      <p className="text-xs text-slate-400">
                        Resume Score
                      </p>

                      <p className={`text-2xl font-bold ${
                        getScore(resume) >= 80
                          ? "text-emerald-600"
                          : getScore(resume) >= 60
                          ? "text-amber-600"
                          : getScore(resume) > 0
                          ? "text-rose-600"
                          : "text-slate-400"
                      }`}>
                        {getScore(resume) > 0 ? `${getScore(resume)}%` : "--"}
                      </p>
                      <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        getScore(resume) >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : getScore(resume) >= 60
                          ? "bg-amber-50 text-amber-700"
                          : getScore(resume) > 0
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {getScore(resume) >= 80
                          ? "Strong"
                          : getScore(resume) >= 60
                          ? "Moderate"
                          : getScore(resume) > 0
                          ? "Needs Review"
                          : "Not Scored"}
                      </span>

                    </div>

                  </div>

                  {/* ==================================
                      SKILLS
                  ================================== */}

                  <div className="mt-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {(resume.skills || [])
                        .slice(0, 6)
                        .map(
                          (
                            skill,
                            index
                          ) => (
                            <span
                              key={index}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {typeof skill ===
                              "string"
                                ? skill
                                : skill?.name ||
                                  JSON.stringify(
                                    skill
                                  )}
                            </span>
                          )
                        )}

                      {resume.skills?.length >
                        6 && (
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                          +
                          {resume.skills
                            .length - 6}{" "}
                          more
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ==================================
                      SUMMARY
                  ================================== */}

                  <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">

                    {resume.ai_analysis
                      ?.summary ||
                      resume.ai_summary ||
                      "No AI summary available."}

                  </p>

                  {/* ==================================
                      ACTIONS
                  ================================== */}

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4">
                    <button
                      onClick={() => navigate(`/resumes/${resume.id}`)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/resumes/${resume.id}/analysis`)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Sparkles size={16} />
                      Analysis
                    </button>

                    <button
                      onClick={() => navigate(`/resume-chat/${resume.id}`)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                    >
                      <MessageSquare size={16} />
                      AI Chat
                    </button>

                    <button
                      onClick={() => handleDeleteResume(resume.id, resume.name)}
                      disabled={deletingId === resume.id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === resume.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      {deletingId === resume.id ? "Deleting" : "Delete"}
                    </button>
                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}


function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={19} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Resumes;