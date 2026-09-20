import {
  FileText,
  Briefcase,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import RecentResumes from "../components/dashboard/RecentResumes";
import RecentJobs from "../components/dashboard/RecentJobs";
import MatchOverview from "../components/dashboard/MatchOverview";

import { getResumes } from "../services/resumeApi";
import { getJobs } from "../services/jobApi";

function Dashboard() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [resumeData, jobData] = await Promise.all([
          getResumes(),
          getJobs(),
        ]);

        setResumes(resumeData || []);
        setJobs(jobData || []);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalResumes = resumes.length;
  const totalJobs = jobs.length;

  // Currently candidates are resumes in the system
  const totalCandidates = resumes.length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, Rohit 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your resume intelligence system.
          </p>
        </div>

        <button
          onClick={() => navigate("/resumes/upload")}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Upload Resume
          <ArrowRight size={17} />
        </button>
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
          value="--"
          change="Coming Soon"
          icon={Target}
        />

      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentResumes />
        <RecentJobs />
      </div>

      {/* Matching */}
      <MatchOverview />

    </div>
  );
}

export default Dashboard;