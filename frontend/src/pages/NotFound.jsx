import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  SearchX,
  Sparkles,
} from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
          <SearchX size={38} strokeWidth={1.8} />
        </div>

        {/* Error Code */}
        <p className="text-7xl font-black tracking-tight text-slate-200 sm:text-8xl">
          404
        </p>

        <div className="-mt-3">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
            <Sparkles size={13} />
            AI Resume Intelligence
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Page not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            The page you're looking for doesn't exist, may have been moved, or
            the URL may be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 sm:w-auto"
          >
            <Home size={17} />
            Back to Dashboard
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Check the URL or return to your dashboard to continue.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
