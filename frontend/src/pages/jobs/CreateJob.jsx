import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Code2,
  Clock3,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { createJob } from "../../services/jobApi";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    required_skills: "",
    experience_required: "",
  });

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      showNotification(
        "error",
        "Job title and description are required."
      );
      return;
    }

    try {
      setLoading(true);

      const jobData = {
        ...formData,
        required_skills: formData.required_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      };

      await createJob(jobData);

      showNotification(
        "success",
        "Job created successfully!"
      );

      setFormData({
        title: "",
        company: "",
        description: "",
        required_skills: "",
        experience_required: "",
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
    } catch (err) {
      console.error("Create job error:", err);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        showNotification(
          "error",
          detail.map((item) => item.msg).join(", ")
        );
      } else {
        showNotification(
          "error",
          detail || "Failed to create job. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex max-w-md items-start gap-3 rounded-xl border px-5 py-4 shadow-lg ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <XCircle
              size={22}
              className="mt-0.5 shrink-0"
            />
          )}

          <div>
            <p className="font-semibold">
              {notification.type === "success"
                ? "Success"
                : "Error"}
            </p>

            <p className="mt-1 text-sm">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Create Job
              </h1>

              <p className="text-sm text-slate-500">
                Add a new job opening for candidate matching
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Job Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Job Title <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. Data Scientist"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. TCS"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Experience Required
            </label>

            <div className="relative">
              <Clock3
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="experience_required"
                value={formData.experience_required}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. 1-3 years"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Required Skills
            </label>

            <div className="relative">
              <Code2
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="text"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. Python, SQL, Machine Learning, Pandas"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Separate multiple skills using commas.
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Job Description <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={7}
                placeholder="Enter the job description, responsibilities and requirements..."
                className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating Job...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;