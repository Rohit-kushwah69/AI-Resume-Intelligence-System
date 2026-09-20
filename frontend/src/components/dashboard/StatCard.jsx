import { ArrowUpRight } from "lucide-react";

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm">
        <span className="flex items-center font-semibold text-emerald-600">
          <ArrowUpRight size={16} />
          {change}
        </span>

        <span className="text-slate-400">from last month</span>
      </div>
    </div>
  );
}

export default StatCard;