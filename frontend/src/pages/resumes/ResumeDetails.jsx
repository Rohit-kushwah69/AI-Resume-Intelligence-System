import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Sparkles,
  Loader2,
  MessageSquare,
  Target,
  History,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import { getResumeById } from "../../services/resumeApi";

function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getResumeById(id);
        setResume(data);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        setError(
          error.response?.data?.detail || "Failed to load resume."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const normalizeArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return value ? [value] : [];
  };

  const getText = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    return JSON.stringify(value);
  };

  const skills = useMemo(
    () => normalizeArray(resume?.skills),
    [resume?.skills]
  );
  const education = useMemo(
    () => normalizeArray(resume?.education),
    [resume?.education]
  );
  const experience = useMemo(
    () => normalizeArray(resume?.experience),
    [resume?.experience]
  );
  const projects = useMemo(
    () => normalizeArray(resume?.projects),
    [resume?.projects]
  );
  const certifications = useMemo(
    () => normalizeArray(resume?.certifications),
    [resume?.certifications]
  );

  const score = Number(resume?.ai_analysis?.resume_score ?? resume?.resume_score);
  const hasScore = Number.isFinite(score);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin text-indigo-600" />
          Loading resume...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!resume) return null;

  const candidateName = resume.name || "Unknown Candidate";
  const initials = candidateName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/resumes")}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
            title="Back to resumes"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Resume Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review candidate profile, experience, skills and AI insights.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/resume-chat/${resume.id}`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <MessageSquare size={17} />
            AI Chat
          </button>

          <button
            onClick={() => navigate(`/resumes/${resume.id}/analysis`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Sparkles size={17} />
            AI Analysis
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />

        <div className="p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
                {initials}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {candidateName}
                </h2>

                <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-5">
                  {resume.email && (
                    <span className="flex items-center gap-2">
                      <Mail size={15} className="text-slate-400" />
                      {resume.email}
                    </span>
                  )}

                  {resume.phone && (
                    <span className="flex items-center gap-2">
                      <Phone size={15} className="text-slate-400" />
                      {resume.phone}
                    </span>
                  )}

                  {resume.file_name && (
                    <span className="flex items-center gap-2">
                      <FileText size={15} className="text-slate-400" />
                      {resume.file_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/matching?resumeId=${resume.id}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Target size={17} />
                Match with Job
              </button>

              <button
                onClick={() => navigate("/matching/history")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <History size={17} />
                Match History
              </button>

              <div className="min-w-[130px] rounded-2xl bg-indigo-50 px-5 py-3 text-center">
                <p className="text-xs font-medium text-indigo-500">
                  Resume Score
                </p>
                <p className="mt-1 text-3xl font-bold text-indigo-700">
                  {hasScore ? score : "--"}
                </p>
                {hasScore && (
                  <p className="mt-0.5 text-[11px] font-medium text-indigo-500">
                    AI evaluation
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick profile stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniStat icon={Code} label="Skills" value={skills.length} />
        <MiniStat icon={Briefcase} label="Experience" value={experience.length} />
        <MiniStat icon={FileText} label="Projects" value={projects.length} />
        <MiniStat icon={Award} label="Certifications" value={certifications.length} />
      </div>

      {/* Skills */}
      <Section title="Skills" icon={Code}>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
              >
                {typeof skill === "string"
                  ? skill
                  : skill?.name || getText(skill)}
              </span>
            ))
          ) : (
            <EmptyState text="No skills available." />
          )}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" icon={GraduationCap}>
        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((item, index) => {
              const value =
                typeof item === "string" ? { degree: item } : item || {};

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-700">
                        {value.degree ||
                          value.qualification ||
                          value.course ||
                          "Education"}
                      </h3>

                      {value.institution && (
                        <p className="mt-1 text-sm text-slate-500">
                          {value.institution}
                        </p>
                      )}
                    </div>

                    {value.year && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                        <CalendarDays size={13} />
                        {value.year}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState text="No education information available." />
        )}
      </Section>

      {/* Experience */}
      <Section title="Experience" icon={Briefcase}>
        {experience.length > 0 ? (
          <div className="space-y-4">
            {experience.map((item, index) => {
              const value =
                typeof item === "string" ? { description: item } : item || {};

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
                >
                  <h3 className="font-semibold text-slate-700">
                    {value.role || value.position || value.title || "Experience"}
                  </h3>

                  {value.company && (
                    <p className="mt-1 text-sm font-medium text-indigo-600">
                      {value.company}
                    </p>
                  )}

                  {value.duration && (
                    <p className="mt-1 text-xs text-slate-400">
                      {value.duration}
                    </p>
                  )}

                  {value.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState text="No experience information available." />
        )}
      </Section>

      {/* Projects */}
      <Section title="Projects" icon={FileText}>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project, index) => {
              const value =
                typeof project === "string"
                  ? { title: project }
                  : project || {};

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
                >
                  <h3 className="font-semibold text-slate-700">
                    {value.title || value.name || "Project"}
                  </h3>

                  {value.technologies && (
                    <p className="mt-1 text-xs font-medium text-indigo-600">
                      {Array.isArray(value.technologies)
                        ? value.technologies.join(", ")
                        : value.technologies}
                    </p>
                  )}

                  {value.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState text="No projects available." />
        )}
      </Section>

      {/* Certifications */}
      <Section title="Certifications" icon={Award}>
        {certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {certifications.map((item, index) => (
              <span
                key={index}
                className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700"
              >
                {typeof item === "string"
                  ? item
                  : item?.name || getText(item)}
              </span>
            ))}
          </div>
        ) : (
          <EmptyState text="No certifications available." />
        )}
      </Section>

      {/* Resume file */}
      {resume.file_name && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Original Resume
              </p>
              <p className="text-xs text-slate-400">{resume.file_name}</p>
            </div>
          </div>

          {resume.file_path && (
            <a
              href={resume.file_path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              Open Resume
            </a>
          )}
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-800">
            Need deeper candidate insights?
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Use AI analysis or chat directly with this resume.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/resumes/${resume.id}/analysis`)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Sparkles size={16} />
            Full AI Analysis
          </button>

          <button
            onClick={() => navigate(`/resume-chat/${resume.id}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <MessageSquare size={16} />
            Chat with Resume
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="text-sm text-slate-400">{text}</p>;
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={19} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default ResumeDetails;
