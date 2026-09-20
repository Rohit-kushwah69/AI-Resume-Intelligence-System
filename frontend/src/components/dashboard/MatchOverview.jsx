import { useEffect, useState } from "react";

import { getResumes } from "../../services/resumeApi";
import { getMatchHistory } from "../../services/matchApi";

function MatchOverview() {
  const [matchData, setMatchData] = useState([
    {
      label: "Exact Skill Match",
      value: 0,
    },
    {
      label: "Semantic Match",
      value: 0,
    },
    {
      label: "Experience Match",
      value: 0,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatchOverview = async () => {
      try {
        const resumes = await getResumes();

        if (!resumes || resumes.length === 0) {
          setLoading(false);
          return;
        }

        const historyResults = await Promise.all(
          resumes.map(async (resume) => {
            try {
              return await getMatchHistory(resume.id);
            } catch (error) {
              console.error(
                `Match history error for resume ${resume.id}:`,
                error
              );

              return [];
            }
          })
        );

        const allMatches = historyResults.flat();

        if (allMatches.length === 0) {
          setLoading(false);
          return;
        }

        const exactTotal = allMatches.reduce(
          (sum, match) => sum + (match.exact_skill_score || 0),
          0
        );

        const semanticTotal = allMatches.reduce(
          (sum, match) => sum + (match.semantic_skill_score || 0),
          0
        );

        const experienceTotal = allMatches.reduce(
          (sum, match) => sum + (match.experience_score || 0),
          0
        );

        const count = allMatches.length;

        setMatchData([
          {
            label: "Exact Skill Match",
            value: Math.round(exactTotal / count),
          },
          {
            label: "Semantic Match",
            value: Math.round(semanticTotal / count),
          },
          {
            label: "Experience Match",
            value: Math.round(experienceTotal / count),
          },
        ]);
      } catch (error) {
        console.error("Match overview error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchOverview();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-800">
          Resume Matching Overview
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          AI-powered candidate matching performance
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-6 text-center text-sm text-slate-400">
          Loading match data...
        </div>
      ) : (
        <div className="space-y-6">
          {matchData.map((item) => (
            <div key={item.label}>
              
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {item.value}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(item.value, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MatchOverview;