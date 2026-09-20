import { Briefcase, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobs } from "../../services/jobApi";

function RecentJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getJobs();

        // Latest jobs first
        const sortedJobs = [...(data || [])].reverse();

        // Dashboard par latest 4 jobs
        setJobs(sortedJobs.slice(0, 4));
      } catch (error) {
        console.error("Recent jobs error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-800">
            Recent Jobs
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Latest job openings
          </p>
        </div>

        <button
          onClick={() => navigate("/jobs")}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all
        </button>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-slate-100">

        {loading ? (
          <div className="p-6 text-center text-sm text-slate-400">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No jobs created yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-slate-50"
            >
              {/* Job Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {job.title}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={13} />

                    {job.company || "Company not specified"}
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">
                  {job.required_skills?.length || 0}
                </p>

                <p className="text-xs text-slate-400">
                  skills
                </p>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default RecentJobs;