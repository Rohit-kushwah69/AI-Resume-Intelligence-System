import { useState } from "react";
import {
  CheckCircle,
  FileText,
  Sparkles,
  Loader2,
  XCircle,
  X,
} from "lucide-react";

import ResumeUpload from "../../components/resume/ResumeUpload";
import { uploadResume } from "../../services/resumeApi";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

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

  const handleUpload = async () => {
    if (!file) {
      showNotification("error", "Please select a resume first.");
      return;
    }

    try {
      setUploading(true);

      const result = await uploadResume(file);

      console.log("Upload Response:", result);

      showNotification(
        "success",
        result.message || "Resume uploaded successfully!"
      );

      console.log("Resume ID:", result.resume_id);
      console.log("Parsed Data:", result.parsed_data);

      setFile(null);
    } catch (error) {
      console.error("Resume upload error:", error);

      const message =
        error.response?.data?.detail ||
        "Failed to upload resume. Please try again.";

      showNotification("error", message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed right-6 top-6 z-50 flex w-[380px] items-start gap-3 rounded-xl border p-4 shadow-lg ${
            notification.type === "success"
              ? "border-emerald-200 bg-white"
              : "border-red-200 bg-white"
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

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {notification.type === "success"
                ? "Success"
                : "Upload Failed"}
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
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Upload Resume
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload a candidate resume and let AI analyze it automatically.
        </p>
      </div>

      {/* Upload Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ResumeUpload onFileSelect={setFile} />

        {/* Selected Resume */}
        {file && (
          <div className="mt-6 rounded-xl bg-indigo-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={20}
                className="text-indigo-600"
              />

              <div>
                <p className="text-sm font-semibold text-indigo-800">
                  Resume ready for analysis
                </p>

                <p className="text-xs text-indigo-600">
                  {file.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {uploading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Upload & Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <FileText
            className="text-indigo-600"
            size={22}
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            PDF Extraction
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Resume content is automatically extracted from
            the uploaded PDF.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Sparkles
            className="text-indigo-600"
            size={22}
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            AI Analysis
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            AI identifies skills, experience, education and
            other resume data.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <CheckCircle
            className="text-indigo-600"
            size={22}
          />

          <h3 className="mt-3 font-semibold text-slate-700">
            Smart Matching
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Resume information can later be matched against
            available jobs.
          </p>
        </div>

      </div>
    </div>
  );
}

export default UploadResume;