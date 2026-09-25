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
  Sparkles,
  Plus,
  X,
  Lightbulb,
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
  const [skillInput, setSkillInput] = useState("");

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

  const skills = formData.required_skills
    ? formData.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      required_skills: [...skills, skill].join(", "),
    }));
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: skills
        .filter(
          (skill) =>
            skill.toLowerCase() !== skillToRemove.toLowerCase()
        )
        .join(", "),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
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

    if (!formData.title.trim()) {
      showNotification("error", "Job title is required.");
      return;
    }

    if (!formData.description.trim()) {
      showNotification("error", "Job description is required.");
      return;
    }

    if (formData.description.trim().length < 30) {
      showNotification(
        "error",
        "Job description should contain at least 30 characters."
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
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-slate-700">
                Required Skills
              </label>

              <span className="text-xs text-slate-400">
                {skills.length} skill{skills.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              {skills.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        disabled={loading}
                        className="rounded-full p-0.5 transition hover:bg-indigo-100 disabled:opacity-50"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Code2
                  size={18}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  disabled={loading}
                  placeholder="Type a skill and press Enter"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  disabled={loading || !skillInput.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Add skills one by one. You can also paste comma-separated
              skills into this field.
            </p>

            {/* Hidden controlled value used by the existing submit flow */}
            <input
              type="hidden"
              name="required_skills"
              value={formData.required_skills}
              readOnly
            />
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
                rows={8}
                placeholder="Describe the role, responsibilities, technical requirements, qualifications and what the candidate will work on..."
                className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                A detailed description improves candidate matching quality.
              </span>
              <span
                className={
                  formData.description.length >= 30
                    ? "font-medium text-green-600"
                    : "text-slate-400"
                }
              >
                {formData.description.length} characters
              </span>
            </div>
          </div>
        </div>

        {/* AI Matching Tips */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Better matching starts with better job data
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Add clear required skills, realistic experience requirements,
                and a detailed description. These fields are used by the
                resume matching workflow.
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-indigo-600" />
                  Use specific technologies
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-indigo-600" />
                  Mention key responsibilities
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-indigo-600" />
                  Define experience clearly
                </span>
              </div>
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