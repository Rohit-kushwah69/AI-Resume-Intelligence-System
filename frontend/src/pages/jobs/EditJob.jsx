import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Clock3,
  FileText,
  Save,
  RefreshCw,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

import { getJobById, updateJob } from "../../services/jobApi";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    required_skills: [],
    experience_required: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const parseSkills = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((skill) =>
          typeof skill === "string" ? skill.trim() : skill?.name || ""
        )
        .filter(Boolean);
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((skill) =>
              typeof skill === "string" ? skill.trim() : skill?.name || ""
            )
            .filter(Boolean);
        }
      } catch {
        // Treat normal comma-separated text as skills.
      }

      return value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const job = await getJobById(id);

      setForm({
        title: job.title || "",
        company: job.company || "",
        description: job.description || "",
        required_skills: parseSkills(job.required_skills),
        experience_required: job.experience_required || "",
      });
    } catch (err) {
      console.error("Edit job fetch error:", err);
      setError(
        err.response?.data?.detail || "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const existing = form.required_skills.map((item) =>
      item.toLowerCase()
    );

    if (!existing.includes(skill.toLowerCase())) {
      setForm((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, skill],
      }));
    }

    setSkillInput("");
    setSuccess("");
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter(
        (_, skillIndex) => skillIndex !== index
      ),
    }));
    setSuccess("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateJob(id, {
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        required_skills: form.required_skills,
        experience_required: form.experience_required.trim(),
      });

      setSuccess("Job updated successfully.");

      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 700);
    } catch (err) {
      console.error("Update job error:", err);
      setError(
        err.response?.data?.detail || "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto mb-3 animate-spin text-indigo-600"
          />
          <p className="text-sm text-slate-500">Loading job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/jobs/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <p className="text-sm text-slate-400">Jobs / Edit</p>
            <h1 className="text-2xl font-bold text-slate-800">
              Edit Job
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 sm:flex">
          <BriefcaseBusiness size={17} />
          Job #{id}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <BriefcaseBusiness size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Job Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update the job details used by the AI matching engine.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Data Scientist"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Company
              </label>
              <div className="relative">
                <Building2
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. ABC Technologies"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience Required
              </label>
              <div className="relative">
                <Clock3
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="experience_required"
                  value={form.experience_required}
                  onChange={handleChange}
                  placeholder="e.g. 2-4 years"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Required Skills
            </label>

            <div className="rounded-xl border border-slate-200 p-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <div className="flex flex-wrap gap-2">
                {form.required_skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="rounded-full p-0.5 hover:bg-indigo-100"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}

                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={
                    form.required_skills.length
                      ? "Add another skill..."
                      : "Type a skill and press Enter"
                  }
                  className="min-w-[220px] flex-1 border-0 px-1 py-1.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {form.required_skills.length} skill
              {form.required_skills.length !== 1 ? "s" : ""} added. Press
              Enter or comma to add a skill.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Job Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {form.description.length} characters
              </span>
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={10}
              placeholder="Describe the role, responsibilities and requirements..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles
                size={19}
                className="mt-0.5 shrink-0 text-indigo-600"
              />
              <div>
                <p className="text-sm font-semibold text-indigo-800">
                  AI Matching Tip
                </p>
                <p className="mt-1 text-xs leading-5 text-indigo-700">
                  Keep required skills specific and include important
                  technologies in the description for better exact and
                  semantic matching.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to={`/jobs/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditJob;
