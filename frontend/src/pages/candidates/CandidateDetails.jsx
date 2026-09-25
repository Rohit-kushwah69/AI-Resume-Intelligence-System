import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Award,
  FolderKanban,
  Target,
  User,
  XCircle,
  Loader2,
  MessageSquare,
  History,
  Sparkles,
} from "lucide-react";

import { getResumeById } from "../../services/resumeApi";

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getResumeById(id);

        setCandidate(data);
      } catch (err) {
        console.error("Candidate details error:", err);

        setError(
          err.response?.data?.detail ||
            "Failed to load candidate details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  /*
  ----------------------------------------------------
  Helper Functions
  ----------------------------------------------------
  */

  const parseValue = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return parsed;
      } catch {
        return value;
      }
    }

    return value;
  };

  const getSkills = (skills) => {
    const parsed = parseValue(skills);

    if (!parsed) {
      return [];
    }

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (typeof parsed === "string") {
      return parsed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getAIAnalysis = () => {
    const analysis = parseValue(candidate?.ai_analysis);

    if (analysis && typeof analysis === "object") {
      return analysis;
    }

    return {};
  };

  const getArrayValue = (value) => {
    const parsed = parseValue(value);

    if (!parsed) {
      return [];
    }

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [parsed];
  };

  /*
  ----------------------------------------------------
  Generic Safe Renderer
  ----------------------------------------------------
  */

  const renderValue = (value) => {
    const parsed = parseValue(value);

    if (
      parsed === null ||
      parsed === undefined ||
      parsed === ""
    ) {
      return null;
    }

    if (
      typeof parsed === "string" ||
      typeof parsed === "number" ||
      typeof parsed === "boolean"
    ) {
      return String(parsed);
    }

    if (Array.isArray(parsed)) {
      return (
        <div className="space-y-2">
          {parsed.map((item, index) => (
            <div key={index}>
              {typeof item === "object" && item !== null ? (
                renderObject(item)
              ) : (
                <p className="text-sm text-slate-600">
                  {String(item)}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof parsed === "object") {
      return renderObject(parsed);
    }

    return null;
  };

  const renderObject = (object) => {
    if (!object || typeof object !== "object") {
      return null;
    }

    return (
      <div className="space-y-3">
        {Object.entries(object).map(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {
            return null;
          }

          return (
            <div key={key}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {formatLabel(key)}
              </p>

              <div className="text-sm text-slate-600">
                {renderValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /*
  ----------------------------------------------------
  Loading
  ----------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto mb-3 animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading candidate details...
          </p>
        </div>
      </div>
    );
  }

  /*
  ----------------------------------------------------
  Error
  ----------------------------------------------------
  */

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/candidates")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Candidates
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle
            size={42}
            className="mx-auto mb-3 text-red-500"
          />

          <h2 className="text-lg font-semibold text-red-700">
            Unable to load candidate
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <User
          size={40}
          className="mx-auto mb-3 text-slate-400"
        />

        <h2 className="font-semibold text-slate-800">
          Candidate not found
        </h2>

        <button
          onClick={() => navigate("/candidates")}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  /*
  ----------------------------------------------------
  Data
  ----------------------------------------------------
  */

  const skills = getSkills(candidate.skills);

  const aiAnalysis = getAIAnalysis();

  const education = parseValue(candidate.education);

  const experience = getArrayValue(candidate.experience);

  const projects = getArrayValue(candidate.projects);

  const certifications = getArrayValue(
    candidate.certifications
  );

  const strengths = Array.isArray(aiAnalysis.strengths)
    ? aiAnalysis.strengths
    : getArrayValue(
        candidate.ai_strengths || aiAnalysis.strengths
      );

  const missingSkills = Array.isArray(
    aiAnalysis.missing_skills
  )
    ? aiAnalysis.missing_skills
    : getArrayValue(
        candidate.ai_missing_skills ||
          aiAnalysis.missing_skills
      );

  const suggestions = Array.isArray(
    aiAnalysis.suggestions
  )
    ? aiAnalysis.suggestions
    : getArrayValue(
        candidate.ai_suggestions ||
          aiAnalysis.suggestions
      );

  const resumeScore =
    aiAnalysis.resume_score ??
    candidate.resume_score ??
    0;

  const aiSummary =
    aiAnalysis.summary ||
    candidate.ai_summary ||
    "No AI summary available.";

  /*
  ----------------------------------------------------
  UI
  ----------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            onClick={() => navigate("/candidates")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Candidates
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
              {candidate.name
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {candidate.name || "Unknown Candidate"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Candidate #{candidate.id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/resumes/${candidate.id}/analysis`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <BrainCircuit size={18} />
            AI Analysis
          </Link>

          <Link
            to={`/resume-chat/${candidate.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <MessageSquare size={18} />
            AI Chat
          </Link>

          <Link
            to={`/matching?resumeId=${candidate.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Target size={18} />
            Match with Job
          </Link>

          <Link
            to={`/matching/history?resumeId=${candidate.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <History size={18} />
            Match History
          </Link>
        </div>
      </div>

      {/* Candidate Overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-700">
                {candidate.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Phone size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {candidate.phone || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Resume
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-700">
                {candidate.file_name || "Resume"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score + Skills */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Resume Score */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Target size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Resume Score
            </h2>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-indigo-100">
              <span className="text-4xl font-bold text-indigo-600">
                {resumeScore}
              </span>

              <span className="text-xs text-slate-400">
                / 100
              </span>
            </div>

            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                <Sparkles size={14} />
                AI Resume Evaluation
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Score generated from the resume analysis available in the system.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <BrainCircuit size={20} />
              </div>

              <h2 className="font-semibold text-slate-800">
                Skills
              </h2>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {skills.length} skills
            </span>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${String(skill)}-${index}`}
                  className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
                >
                  {typeof skill === "object"
                    ? renderValue(skill)
                    : String(skill)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No skills available.
            </p>
          )}
        </section>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Education */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <GraduationCap size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Education
            </h2>
          </div>

          {education ? (
            Array.isArray(education) ? (
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    {typeof edu === "object" ? (
                      <div className="space-y-2">
                        {edu.degree && (
                          <h3 className="font-semibold text-slate-800">
                            {edu.degree}
                          </h3>
                        )}

                        {edu.field && (
                          <p className="text-sm text-slate-600">
                            {edu.field}
                          </p>
                        )}

                        {edu.institution && (
                          <p className="text-sm text-slate-500">
                            {edu.institution}
                          </p>
                        )}

                        {edu.year && (
                          <p className="text-xs text-slate-400">
                            {edu.year}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600">
                        {String(edu)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof education === "object" ? (
              <div className="rounded-xl bg-slate-50 p-4">
                {education.degree && (
                  <h3 className="font-semibold text-slate-800">
                    {education.degree}
                  </h3>
                )}

                {education.field && (
                  <p className="mt-1 text-sm text-slate-600">
                    {education.field}
                  </p>
                )}

                {education.institution && (
                  <p className="mt-2 text-sm text-slate-500">
                    {education.institution}
                  </p>
                )}

                {education.year && (
                  <p className="mt-1 text-xs text-slate-400">
                    {education.year}
                  </p>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-line text-sm text-slate-600">
                {String(education)}
              </p>
            )
          ) : (
            <p className="text-sm text-slate-400">
              No education information available.
            </p>
          )}
        </section>

        {/* Experience */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Briefcase size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Experience
            </h2>
          </div>

          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  {typeof exp === "object" ? (
                    <>
                      <h3 className="font-semibold text-slate-800">
                        {exp.role || "Role not specified"}
                      </h3>

                      {exp.company && (
                        <p className="mt-1 text-sm font-medium text-indigo-600">
                          {exp.company}
                        </p>
                      )}

                      {exp.location && (
                        <p className="mt-1 text-sm text-slate-500">
                          {exp.location}
                        </p>
                      )}

                      {exp.duration && (
                        <p className="mt-1 text-xs text-slate-400">
                          {exp.duration}
                        </p>
                      )}

                      {exp.responsibilities && (
                        <div className="mt-4">
                          <p className="mb-2 text-sm font-semibold text-slate-700">
                            Responsibilities
                          </p>

                          {Array.isArray(
                            exp.responsibilities
                          ) ? (
                            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                              {exp.responsibilities.map(
                                (item, i) => (
                                  <li key={i}>
                                    {typeof item ===
                                    "object"
                                      ? renderValue(item)
                                      : String(item)}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="whitespace-pre-line text-sm text-slate-600">
                              {String(
                                exp.responsibilities
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="whitespace-pre-line text-sm text-slate-600">
                      {String(exp)}
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
        </section>

        {/* Projects */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <FolderKanban size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Projects
            </h2>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  {typeof project === "object" ? (
                    <>
                      {project.name && (
                        <h3 className="font-semibold text-slate-800">
                          {project.name}
                        </h3>
                      )}

                      {project.title && (
                        <h3 className="font-semibold text-slate-800">
                          {project.title}
                        </h3>
                      )}

                      {project.description && (
                        <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                          {project.description}
                        </p>
                      )}

                      {project.technologies && (
                        <div className="mt-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Technologies
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(
                              project.technologies
                            ) ? (
                              project.technologies.map(
                                (tech, i) => (
                                  <span
                                    key={i}
                                    className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
                                  >
                                    {typeof tech ===
                                    "object"
                                      ? renderValue(tech)
                                      : String(tech)}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                {String(
                                  project.technologies
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {!project.name &&
                        !project.title &&
                        !project.description &&
                        !project.technologies && (
                          renderObject(project)
                        )}
                    </>
                  ) : (
                    <p className="whitespace-pre-line text-sm text-slate-600">
                      {String(project)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No projects information available.
            </p>
          )}
        </section>

        {/* Certifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Award size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Certifications
            </h2>
          </div>

          {certifications.length > 0 ? (
            <div className="space-y-3">
              {certifications.map((certificate, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  {typeof certificate === "object" ? (
                    renderObject(certificate)
                  ) : (
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-green-500"
                      />

                      <p className="text-sm text-slate-600">
                        {String(certificate)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No certifications available.
            </p>
          )}
        </section>
      </div>

      {/* AI Summary */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <BrainCircuit size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              AI Resume Summary
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              AI-generated candidate analysis
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
            {typeof aiSummary === "object"
              ? renderValue(aiSummary)
              : String(aiSummary)}
          </p>
        </div>
      </section>

      {/* AI Strengths + Missing Skills */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <section className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2 text-green-600">
              <CheckCircle2 size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              AI Strengths
            </h2>
          </div>

          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-green-50 p-3"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <span className="text-sm text-slate-600">
                    {typeof strength === "object"
                      ? renderValue(strength)
                      : String(strength)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              No strengths available.
            </p>
          )}
        </section>

        {/* Missing Skills */}
        <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
              <XCircle size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Missing Skills
            </h2>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600"
                >
                  {typeof skill === "object"
                    ? renderValue(skill)
                    : String(skill)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No missing skills identified.
            </p>
          )}
        </section>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <BrainCircuit size={20} />
            </div>

            <h2 className="font-semibold text-slate-800">
              AI Suggestions
            </h2>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
              >
                <ChevronRight
                  size={18}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <p className="text-sm leading-6 text-slate-600">
                  {typeof suggestion === "object"
                    ? renderValue(suggestion)
                    : String(suggestion)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recruiter Actions */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={19} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-800">
                Continue Candidate Evaluation
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Analyze, chat with, or compare this candidate with available jobs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/resume-chat/${candidate.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <MessageSquare size={17} />
              Chat with Resume
            </Link>

            <Link
              to={`/resumes/${candidate.id}/analysis`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <BrainCircuit size={17} />
              Full AI Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CandidateDetails;