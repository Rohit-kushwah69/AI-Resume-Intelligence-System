import { useRef, useState } from "react";
import {
  CheckCircle,
  FileText,
  Sparkles,
  Loader2,
  XCircle,
  X,
  UploadCloud,
  ShieldCheck,
  BrainCircuit,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ResumeUpload from "../../components/resume/ResumeUpload";
import { uploadResume } from "../../services/resumeApi";

function UploadResume() {
  const navigate = useNavigate();
  const uploadButtonRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 4000);
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      showNotification("error", "Only PDF resume files are supported.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setFile(null);
      showNotification("error", "Resume file size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setUploadedResumeId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("error", "Please select a PDF resume first.");
      return;
    }

    try {
      setUploading(true);
      setUploadedResumeId(null);

      const result = await uploadResume(file);

      console.log("Upload Response:", result);

      const resumeId = result?.resume_id ?? result?.id ?? null;
      setUploadedResumeId(resumeId);

      showNotification(
        "success",
        result?.message || "Resume uploaded and analyzed successfully!"
      );
    } catch (error) {
      console.error("Resume upload error:", error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to upload resume. Please try again.";

      showNotification("error", message);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedResumeId(null);
    setNotification({
      show: false,
      type: "",
      message: "",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex w-[min(380px,calc(100vw-32px))] items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
            notification.type === "success"
              ? "border-emerald-200"
              : "border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle
              size={22}
              className="mt-0.5 shrink-0 text-emerald-500"
            />
          ) : (
            <XCircle
              size={22}
              className="mt-0.5 shrink-0 text-red-500"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {notification.type === "success" ? "Upload Complete" : "Upload Failed"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {notification.message}
            </p>
          </div>

          <button
            onClick={() =>
              setNotification({
                show: false,
                type: "",
                message: "",
              })
            }
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} />
            AI Resume Intelligence
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Upload Resume
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Upload a candidate resume and let the system extract resume data,
            analyze it with AI, and prepare it for intelligent job matching.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <ShieldCheck size={16} className="text-emerald-500" />
          Secure resume processing
        </div>
      </div>

      {/* Upload Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <UploadCloud size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Resume Upload
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                PDF only · Maximum file size 10 MB
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResumeUpload onFileSelect={handleFileSelect} />

          {/* Selected File */}
          {file && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-indigo-900">
                      {file.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-indigo-600">
                      <span>PDF</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="font-medium">Ready for AI analysis</span>
                    </div>
                  </div>
                </div>

                {!uploading && !uploadedResumeId && (
                  <button
                    onClick={resetUpload}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <RotateCcw size={14} />
                    Change File
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Processing resume...
                </span>
                <span className="font-medium text-indigo-600">
                  AI analysis in progress
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-600" />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin text-indigo-600" />
                Extracting and analyzing resume information...
              </div>
            </div>
          )}

          {/* Success Actions */}
          {uploadedResumeId && !uploading && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    Resume processed successfully
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Your resume is now available for AI analysis and job
                    matching.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() =>
                        navigate(`/resumes/${uploadedResumeId}`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      View Resume
                      <ArrowRight size={15} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/resumes/${uploadedResumeId}/analysis`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <Sparkles size={15} />
                      AI Analysis
                    </button>

                    <button
                      onClick={resetUpload}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <UploadCloud size={15} />
                      Upload Another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploadedResumeId && (
            <button
              ref={uploadButtonRef}
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  Upload & Analyze Resume
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Processing Steps */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={17} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-800">
            What happens after upload?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={FileText}
            title="1. Extract"
            description="Resume content is extracted from the uploaded PDF for further processing."
          />

          <InfoCard
            icon={BrainCircuit}
            title="2. Analyze"
            description="AI identifies skills, experience, education, projects and other resume information."
          />

          <InfoCard
            icon={CheckCircle}
            title="3. Match"
            description="The processed resume can be compared with job requirements using intelligent matching."
          />
        </div>
      </div>

      {/* Upload Tips */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-800">
          Upload tips
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 text-xs leading-5 text-slate-500 md:grid-cols-2">
          <p>• Use a clear, text-based PDF for better extraction.</p>
          <p>• Keep the resume within the 10 MB file-size limit.</p>
          <p>• Include skills, education, experience and projects.</p>
          <p>• Avoid password-protected or corrupted PDF files.</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default UploadResume;
