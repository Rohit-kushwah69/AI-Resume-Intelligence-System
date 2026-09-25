import {
  FileText,
  Briefcase,
  Users,
  Target,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import RecentResumes from "../components/dashboard/RecentResumes";
import RecentJobs from "../components/dashboard/RecentJobs";
import MatchOverview from "../components/dashboard/MatchOverview";

import { getResumes } from "../services/resumeApi";
import {
  getJobs,
  getMatchCount,
} from "../services/jobApi";

function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [resumeData, jobData, matchData] = await Promise.all([
        getResumes(),
        getJobs(),
        getMatchCount(),
      ]);

      setResumes(Array.isArray(resumeData) ? resumeData : []);
      setJobs(Array.isArray(jobData) ? jobData : []);
      setMatchCount(Number(matchData?.total_matches || 0));
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalResumes = resumes.length;
  const totalJobs = jobs.length;
  const totalCandidates = resumes.length;

  const latestResume = useMemo(() => {
    return [...resumes].sort(
      (a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    )[0];
  }, [resumes]);

  const latestJob = useMemo(() => {
    return [...jobs].sort(
      (a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    )[0];
  }, [jobs]);

  const resumeCompletion = Math.min(
    100,
    totalResumes > 0
      ? Math.round((resumes.filter((resume) => resume.ai_summary).length / totalResumes) * 100)
      : 0
  );

  const jobCompletion = Math.min(
    100,
    totalJobs > 0
      ? Math.round((jobs.filter((job) => job.required_skills).length / totalJobs) * 100)
      : 0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-indigo-600">
            AI Resume Intelligence
          </p>

          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, Rohit 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your resume intelligence system.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={() => navigate("/resumes/upload")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Upload Resume
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Resumes"
          value={loading ? "..." : totalResumes}
          change="Live Data"
          icon={FileText}
        />

        <StatCard
          title="Active Jobs"
          value={loading ? "..." : totalJobs}
          change="Live Data"
          icon={Briefcase}
        />

        <StatCard
          title="Candidates"
          value={loading ? "..." : totalCandidates}
          change="Live Data"
          icon={Users}
        />

        <StatCard
          title="Matches"
          value={loading ? "..." : matchCount}
          change="Live Data"
          icon={Target}
        />

      </div>

      {/* System Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    System Overview
                  </h2>
                  <p className="text-xs text-slate-500">
                    Current data and processing coverage
                  </p>
                </div>
              </div>
            </div>

            <Sparkles size={20} className="text-indigo-500" />
          </div>

          <div className="mt-6 space-y-5">

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Resume AI Analysis
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {loading ? "..." : `${resumeCompletion}%`}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${resumeCompletion}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Jobs With Required Skills
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {loading ? "..." : `${jobCompletion}%`}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${jobCompletion}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            Latest Activity
          </h2>

          <div className="mt-5 space-y-4">

            <button
              onClick={() =>
                latestResume?.id &&
                navigate(`/resumes/${latestResume.id}`)
              }
              disabled={!latestResume?.id}
              className="flex w-full items-start gap-3 rounded-xl bg-slate-50 p-4 text-left transition hover:bg-indigo-50 disabled:cursor-default"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <FileText size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Latest Resume
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {latestResume?.name || "No resume uploaded"}
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                latestJob?.id &&
                navigate(`/jobs/${latestJob.id}`)
              }
              disabled={!latestJob?.id}
              className="flex w-full items-start gap-3 rounded-xl bg-slate-50 p-4 text-left transition hover:bg-indigo-50 disabled:cursor-default"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Briefcase size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Latest Job
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {latestJob?.title || "No job created"}
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/matching/history")}
              className="flex w-full items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left transition hover:bg-indigo-100"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Match History
                </p>
                <p className="mt-1 text-sm font-semibold text-indigo-700">
                  View {matchCount} saved match{matchCount === 1 ? "" : "es"}
                </p>
              </div>

              <ArrowRight size={18} className="text-indigo-600" />
            </button>

          </div>
        </div>

      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentResumes />
        <RecentJobs />
      </div>

      {/* Matching */}
      <MatchOverview />

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Continue working with your resume intelligence system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate("/resumes/upload")}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <FileText className="mb-3 text-indigo-600" size={22} />
            <p className="font-semibold text-slate-800">Upload Resume</p>
            <p className="mt-1 text-xs text-slate-500">
              Add and analyze a new resume
            </p>
          </button>

          <button
            onClick={() => navigate("/jobs/create")}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <Briefcase className="mb-3 text-indigo-600" size={22} />
            <p className="font-semibold text-slate-800">Create Job</p>
            <p className="mt-1 text-xs text-slate-500">
              Add a new job description
            </p>
          </button>

          <button
            onClick={() => navigate("/matching")}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <Target className="mb-3 text-indigo-600" size={22} />
            <p className="font-semibold text-slate-800">Run Matching</p>
            <p className="mt-1 text-xs text-slate-500">
              Compare a resume with a job
            </p>
          </button>

          <button
            onClick={() => navigate("/matching/history")}
            className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <Users className="mb-3 text-indigo-600" size={22} />
            <p className="font-semibold text-slate-800">Match History</p>
            <p className="mt-1 text-xs text-slate-500">
              Review previous matches
            </p>
          </button>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
