import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Sparkles,
  RefreshCw,
  Trash2,
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

  const filteredResumes = resumes.filter(
    (resume) => {
      const searchText =
        search.toLowerCase();

      return (
        resume.name
          ?.toLowerCase()
          .includes(searchText) ||
        resume.email
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Resumes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and analyze uploaded candidate resumes.
          </p>
        </div>

        <button
          onClick={fetchResumes}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={17} />

          Refresh
        </button>

      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="relative">

        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-400"
        />

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

                      <p className="text-2xl font-bold text-indigo-600">
                        {resume.ai_analysis
                          ?.resume_score ??
                          resume.resume_score ??
                          "--"}
                      </p>

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

                  <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">

                    {/* VIEW RESUME */}

                    <button
                      onClick={() => {
                        window.location.href = `/resumes/${resume.id}`;
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <Eye size={17} />

                      View Resume
                    </button>

                    {/* AI ANALYSIS */}

                    <button
                      onClick={() => {
                        window.location.href = `/resumes/${resume.id}/analysis`;
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <Sparkles size={17} />

                      AI Analysis
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeleteResume(
                          resume.id,
                          resume.name
                        )
                      }
                      disabled={
                        deletingId ===
                        resume.id
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {deletingId ===
                      resume.id ? (
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}

                      {deletingId ===
                      resume.id
                        ? "Deleting..."
                        : "Delete"}

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

export default Resumes;