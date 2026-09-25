import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function ResumeUpload({ onFileSelect }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF resume files are supported.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10 MB.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      setFile(null);
      onFileSelect(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
    setError("");
    onFileSelect(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    onFileSelect(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
    <div className="space-y-4">
      {/* Upload Area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
            isDragging
              ? "border-indigo-500 bg-indigo-50 shadow-inner"
              : error
              ? "border-red-300 bg-red-50/40"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Icon */}
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition ${
              isDragging
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            <UploadCloud size={29} />
          </div>

          {/* Heading */}
          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            {isDragging
              ? "Drop your resume here"
              : "Upload your resume"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Drag and drop your resume here, or browse your computer to
            select a PDF file.
          </p>

          {/* Browse */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <UploadCloud size={17} />
            Browse PDF
          </button>

          {/* Supported format */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              PDF only
            </span>

            <span className="rounded-full bg-white px-3 py-1 shadow-sm">
              Maximum 10 MB
            </span>
          </div>
        </div>
      ) : (
        /* Selected File */
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <FileText size={23} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {file.name}
                  </p>

                  <CheckCircle
                    size={16}
                    className="shrink-0 text-emerald-500"
                  />
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span>PDF</span>
                  <span>•</span>
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="font-medium text-emerald-600">
                    Ready
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <X size={15} />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-xs leading-5 text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <CheckCircle size={14} className="text-emerald-500" />
        Resume will be processed securely for AI analysis.
      </div>
    </div>
  );
}

export default ResumeUpload;