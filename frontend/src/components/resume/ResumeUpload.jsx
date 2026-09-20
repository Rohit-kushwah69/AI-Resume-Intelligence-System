import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

function ResumeUpload({ onFileSelect }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Upload size={28} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-700">
          Upload your resume
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Drag & drop your PDF here or click to browse
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Supported format: PDF
        </p>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                {file.name}
              </p>

              <p className="text-xs text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;