import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  RefreshCw,
  MapPin,
  Clock3,
  Building2,
  Eye,
  Trash2,
  Users,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";

import {
  getJobs,
  deleteJob,
} from "../../services/jobApi";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Jobs fetch error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDeleteJob = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        title || "this job"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteJob(id);

      // Remove job from UI immediately
      setJobs((prev) =>
        prev.filter((job) => job.id !== id)
      );

    } catch (err) {
      console.error("Delete job error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.description?.toLowerCase().includes(searchText);

    const experience = String(
      job.experience_required || ""
    ).toLowerCase();

    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "fresher" &&
        (experience.includes("fresher") ||
          experience.includes("0") ||
          experience.includes("entry"))) ||
      (experienceFilter === "junior" &&
        (experience.includes("1") ||
          experience.includes("2") ||
          experience.includes("junior"))) ||
      (experienceFilter === "senior" &&
        (experience.includes("3") ||
          experience.includes("4") ||
          experience.includes("5") ||
          experience.includes("senior")));

    return matchesSearch && matchesExperience;
  });

  const jobsWithSkills = jobs.filter(
    (job) =>
      Array.isArray(job.required_skills)
        ? job.required_skills.length > 0
        : Boolean(job.required_skills)
  ).length;

  const jobsWithExperience = jobs.filter(
    (job) => Boolean(job.experience_required)
  ).length;

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Jobs
              </h1>

              <p className="text-sm text-slate-500">
                Manage job openings and requirements
              </p>
            </div>

          </div>
        </div>

        <Link
          to="/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Create Job
        </Link>

      </div>

      {/* ======================================
          SEARCH + REFRESH
      ====================================== */}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto]">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search jobs by title, company..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        <div className="relative">
          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="h-full min-w-[190px] rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All Experience</option>
            <option value="fresher">Fresher / Entry</option>
            <option value="junior">1 - 2 Years</option>
            <option value="senior">3+ Years</option>
          </select>
        </div>

        <button
          onClick={fetchJobs}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ======================================
          JOB STATS
      ====================================== */}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Jobs
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {jobs.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Job openings created
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              With Skills
            </p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {jobsWithSkills}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Jobs with skill requirements
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Experience Defined
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {jobsWithExperience}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Jobs with experience criteria
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Showing
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {filteredJobs.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              After current filters
            </p>
          </div>
        </div>
      )}


      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

          <div className="text-center">

            <RefreshCw
              size={30}
              className="mx-auto mb-3 animate-spin text-indigo-600"
            />

            <p className="text-sm text-slate-500">
              Loading jobs...
            </p>

          </div>

        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchJobs}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        !error &&
        filteredJobs.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <BriefcaseBusiness size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              {search
                ? "No jobs found"
                : "No jobs available"}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try searching with a different job title or company name."
                : "Create your first job opening to start matching candidates."}
            </p>

            {!search && (
              <Link
                to="/jobs/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={18} />
                Create Job
              </Link>
            )}

          </div>
        )}

      {/* ======================================
          JOB CARDS
      ====================================== */}

      {!loading &&
        !error &&
        filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
              >

                {/* ==================================
                    TITLE
                ================================== */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-lg font-bold text-slate-800">
                      {job.title}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                      <Building2 size={16} />

                      <span>
                        {job.company ||
                          "Company not specified"}
                      </span>

                    </div>

                  </div>

                  <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                    Job #{job.id}
                  </div>

                </div>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {job.description ||
                    "No description available."}
                </p>

                {/* ==================================
                    JOB INFO
                ================================== */}

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                      <BriefcaseBusiness size={15} />

                      Required Skills

                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(Array.isArray(job.required_skills)
                        ? job.required_skills
                        : typeof job.required_skills === "string"
                          ? job.required_skills
                              .split(",")
                              .map((skill) => skill.trim())
                              .filter(Boolean)
                          : []
                      )
                        .slice(0, 5)
                        .map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                          >
                            {String(skill)}
                          </span>
                        ))}

                      {((Array.isArray(job.required_skills)
                        ? job.required_skills
                        : typeof job.required_skills === "string"
                          ? job.required_skills.split(",").filter(Boolean)
                          : []
                      ).length === 0) && (
                        <span className="text-sm font-medium text-slate-400">
                          Not specified
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                      <Clock3 size={15} />

                      Experience

                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {job.experience_required ||
                        "Not specified"}
                    </p>

                  </div>

                </div>

                {/* ==================================
                    FOOTER
                ================================== */}

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2 text-xs text-slate-400">

                    <MapPin size={14} />

                    Job Requirement

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    <Link
                      to={`/matching?jobId=${job.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Users size={16} />
                      Match Resume
                    </Link>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeleteJob(
                          job.id,
                          job.title
                        )
                      }
                      disabled={
                        deletingId ===
                        job.id
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {deletingId ===
                      job.id ? (
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      {deletingId ===
                      job.id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default Jobs;