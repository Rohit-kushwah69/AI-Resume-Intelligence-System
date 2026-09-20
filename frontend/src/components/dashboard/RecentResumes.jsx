import { FileText, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getResumes } from "../../services/resumeApi";

function RecentResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await getResumes();

        // Latest uploaded resumes first
        const sortedResumes = [...(data || [])].reverse();

        // Dashboard par sirf latest 4
        setResumes(sortedResumes.slice(0, 4));
      } catch (error) {
        console.error("Recent resumes error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-800">
            Recent Resumes
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Recently uploaded resumes
          </p>
        </div>

        <button
          onClick={() => navigate("/resumes")}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all
        </button>
      </div>

      {/* Resume List */}
      <div className="divide-y divide-slate-100">

        {loading ? (
          <div className="p-6 text-center text-sm text-slate-400">
            Loading resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No resumes uploaded yet.
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => navigate(`/resumes/${resume.id}`)}
              className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileText size={19} />
                </div>

                {/* Resume Info */}
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {resume.name || "Unknown Candidate"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {resume.file_name || "Resume"}
                  </p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {resume.created_at
                    ? new Date(resume.created_at).toLocaleDateString()
                    : ""}
                </span>

                <MoreHorizontal
                  size={18}
                  className="text-slate-400"
                />
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default RecentResumes;