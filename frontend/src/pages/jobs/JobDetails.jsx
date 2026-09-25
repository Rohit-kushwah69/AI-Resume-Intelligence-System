import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Code2,
  FileText,
  RefreshCw,
  UserSearch,
  Trash2,
  Pencil,
  CalendarDays,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";

import {
  getJobById,
  deleteJob,
} from "../../services/jobApi";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH JOB
  // ==========================================

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobById(id);

      setJob(data);
    } catch (err) {
      console.error("Job details error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDeleteJob = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        job?.title || "this job"
      }"?\n\nThis will also delete the saved match history for this job.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteJob(id);

      navigate("/jobs");
    } catch (err) {
      console.error("Delete job error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete job."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // LOAD JOB
  // ==========================================

  useEffect(() => {
    fetchJob();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">

          <RefreshCw
            size={32}
            className="mx-auto mb-3 animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading job details...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchJob}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  if (!job) {
    return null;
  }

  // ==========================================
  // REQUIRED SKILLS
  // ==========================================

  const skills = Array.isArray(job.required_skills)
    ? job.required_skills
    : typeof job.required_skills === "string"
      ? job.required_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const descriptionLength = (job.description || "").length;
  const createdDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString()
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/jobs")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>

            <p className="text-sm text-slate-400">
              Jobs / Details
            </p>

            <h1 className="text-2xl font-bold text-slate-800">
              {job.title}
            </h1>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          {/* EDIT JOB */}

          <Link
            to={`/jobs/${job.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <Pencil size={18} />
            Edit Job
          </Link>

          {/* DELETE JOB */}

          <button
            onClick={handleDeleteJob}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {deleting ? (
              <RefreshCw
                size={18}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={18} />
            )}

            {deleting
              ? "Deleting..."
              : "Delete Job"}

          </button>

          {/* FIND CANDIDATES */}

          <Link
            to={`/matching?jobId=${job.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <UserSearch size={18} />
            Find Candidates
          </Link>

        </div>

      </div>

      {/* ======================================
          JOB OVERVIEW
      ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <BriefcaseBusiness size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              {job.title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <Building2 size={17} />
                {job.company ||
                  "Company not specified"}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={17} />
                {job.experience_required ||
                  "Experience not specified"}
              </div>

              {createdDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  Created {createdDate}
                </div>
              )}

            </div>

          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:min-w-[130px]">
            <div className="rounded-xl bg-indigo-50 px-4 py-3 text-center">
              <p className="text-xs font-medium text-indigo-500">
                JOB ID
              </p>
              <p className="mt-1 text-lg font-bold text-indigo-700">
                #{job.id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-medium text-slate-500">
                SKILLS
              </p>
              <p className="mt-1 text-lg font-bold text-slate-700">
                {skills.length}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================
          QUICK JOB INSIGHTS
      ====================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Target size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Required Skills
              </p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {skills.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FileText size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Description
              </p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {descriptionLength}
              </p>
              <p className="text-[11px] text-slate-400">characters</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <BarChart3 size={19} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Matching
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                AI Skill + Semantic
              </p>
              <p className="text-[11px] text-slate-400">
                Ready for candidates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* DESCRIPTION */}

        <div className="lg:col-span-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileText size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-800">
                Job Description
              </h2>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.description ||
                  "No description available."}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Job description</span>
              <span>{descriptionLength} characters</span>
            </div>

          </div>

        </div>

        {/* SIDEBAR */}

        <div className="space-y-6">

          {/* EXPERIENCE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Clock3 size={20} />
              </div>

              <div>

                <p className="text-xs text-slate-400">
                  Experience
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {job.experience_required ||
                    "Not specified"}
                </p>

              </div>

            </div>

          </div>

          {/* REQUIRED SKILLS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Code2 size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Required Skills
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {skills.length} skill{skills.length !== 1 ? "s" : ""} required
                </p>
              </div>

            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">

                {skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
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

              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No skills specified.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ======================================
          CANDIDATE MATCHING
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Ready to find matching candidates?
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                Compare this job with uploaded resumes using exact skills,
                semantic similarity and experience matching.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  Exact Skill Match
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  Semantic Match
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  Experience Match
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/matching?jobId=${job.id}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <UserSearch size={18} />
            Match Candidates
          </Link>

        </div>
      </div>

    </div>
  );
}

export default JobDetails;