import {
  FileText,
  Briefcase,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RecentResumes from "../components/dashboard/RecentResumes";
import RecentJobs from "../components/dashboard/RecentJobs";
import MatchOverview from "../components/dashboard/MatchOverview";

function Dashboard() {
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

        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          Upload Resume
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Resumes"
          value="24"
          change="+12.5%"
          icon={FileText}
        />

        <StatCard
          title="Active Jobs"
          value="12"
          change="+8.2%"
          icon={Briefcase}
        />

        <StatCard
          title="Candidates"
          value="48"
          change="+15.4%"
          icon={Users}
        />

        <StatCard
          title="Matches"
          value="76"
          change="+18.7%"
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