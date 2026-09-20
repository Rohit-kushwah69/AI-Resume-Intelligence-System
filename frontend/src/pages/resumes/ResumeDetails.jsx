import { useEffect, useState } from "react";
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

        const data = await getResumeById(id);

        setResume(data);
      } catch (error) {
        console.error("Failed to fetch resume:", error);

        setError(
          error.response?.data?.detail ||
            "Failed to load resume."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin text-indigo-600"
          />
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

  if (!resume) {
    return null;
  }

  const skills = resume.skills || [];
  const education = resume.education || [];
  const experience = resume.experience || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/resumes")}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Resume Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Candidate resume information
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/resumes/${resume.id}/analysis`)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Sparkles size={18} />
          AI Analysis
        </button>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <User size={30} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {resume.name || "Unknown Candidate"}
              </h2>

              <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-5">

                {resume.email && (
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {resume.email}
                  </span>
                )}

                {resume.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={15} />
                    {resume.phone}
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* Resume Score */}
          <div className="rounded-2xl bg-indigo-50 px-6 py-4 text-center">
            <p className="text-xs font-medium text-indigo-500">
              Resume Score
            </p>

            <p className="mt-1 text-3xl font-bold text-indigo-700">
              {resume.ai_analysis?.resume_score ?? "--"}
            </p>
          </div>

        </div>
      </div>

      {/* Skills */}
      <Section
        title="Skills"
        icon={Code}
      >
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
              >
                {typeof skill === "string"
                  ? skill
                  : skill.name || JSON.stringify(skill)}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No skills available.
            </p>
          )}
        </div>
      </Section>

      {/* Education */}
      <Section
        title="Education"
        icon={GraduationCap}
      >
        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-50 p-4"
              >
                <h3 className="font-semibold text-slate-700">
                  {item.degree || "Education"}
                </h3>

                {item.institution && (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.institution}
                  </p>
                )}

                {item.year && (
                  <p className="mt-1 text-xs text-slate-400">
                    {item.year}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No education information available.
          </p>
        )}
      </Section>

      {/* Experience */}
      <Section
        title="Experience"
        icon={Briefcase}
      >
        {experience.length > 0 ? (
          <div className="space-y-4">
            {experience.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-50 p-4"
              >
                <h3 className="font-semibold text-slate-700">
                  {item.role ||
                    item.position ||
                    "Experience"}
                </h3>

                {item.company && (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.company}
                  </p>
                )}

                {item.duration && (
                  <p className="mt-1 text-xs text-slate-400">
                    {item.duration}
                  </p>
                )}

                {item.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No experience information available.
          </p>
        )}
      </Section>

      {/* Projects */}
      <Section
        title="Projects"
        icon={FileText}
      >
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-50 p-4"
              >
                <h3 className="font-semibold text-slate-700">
                  {project.title ||
                    project.name ||
                    "Project"}
                </h3>

                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No projects available.
          </p>
        )}
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        icon={Award}
      >
        {certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {certifications.map((item, index) => (
              <span
                key={index}
                className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700"
              >
                {typeof item === "string"
                  ? item
                  : item.name || JSON.stringify(item)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No certifications available.
          </p>
        )}
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={19} />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

export default ResumeDetails;