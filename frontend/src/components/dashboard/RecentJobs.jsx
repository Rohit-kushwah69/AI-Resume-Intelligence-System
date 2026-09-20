import { Briefcase, MapPin } from "lucide-react";

const jobs = [
  {
    title: "Python Developer",
    location: "Hyderabad",
    candidates: 18,
  },
  {
    title: "Machine Learning Engineer",
    location: "Bangalore",
    candidates: 12,
  },
  {
    title: "Data Scientist",
    location: "Pune",
    candidates: 24,
  },
  {
    title: "Data Analyst",
    location: "Delhi",
    candidates: 9,
  },
];

function RecentJobs() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-800">
            Recent Jobs
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Latest job openings
          </p>
        </div>

        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {jobs.map((job) => (
          <div key={job.title} className="flex items-center justify-between p-4">
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
                  {job.location}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">
                {job.candidates}
              </p>

              <p className="text-xs text-slate-400">
                candidates
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentJobs;