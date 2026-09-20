const matchData = [
  {
    label: "Exact Skill Match",
    value: 82,
  },
  {
    label: "Semantic Match",
    value: 74,
  },
  {
    label: "Experience Match",
    value: 78,
  },
];

function MatchOverview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-slate-800">
          Resume Matching Overview
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          AI-powered candidate matching performance
        </p>
      </div>

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
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchOverview;