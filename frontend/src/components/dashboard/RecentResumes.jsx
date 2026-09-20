import { FileText, MoreHorizontal } from "lucide-react";

const resumes = [
  {
    name: "Rahul Sharma",
    role: "Data Scientist",
    date: "Today, 10:30 AM",
  },
  {
    name: "Aman Verma",
    role: "ML Engineer",
    date: "Yesterday",
  },
  {
    name: "Priya Singh",
    role: "Python Developer",
    date: "Sep 17, 2026",
  },
  {
    name: "Vikas Kumar",
    role: "Data Analyst",
    date: "Sep 16, 2026",
  },
];

function RecentResumes() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-800">
            Recent Resumes
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Recently uploaded resumes
          </p>
        </div>

        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {resumes.map((resume) => (
          <div
            key={resume.name}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {resume.name}
                </p>

                <p className="text-xs text-slate-400">
                  {resume.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {resume.date}
              </span>

              <MoreHorizontal size={18} className="text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentResumes;