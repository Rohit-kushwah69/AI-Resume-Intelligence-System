import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/Dashboard";

import Resumes from "./pages/resumes/Resumes";
import UploadResume from "./pages/resumes/UploadResume";
import ResumeDetails from "./pages/resumes/ResumeDetails";
import ResumeAnalysis from "./pages/resumes/ResumeAnalysis";

import Jobs from "./pages/jobs/Jobs";
import CreateJob from "./pages/jobs/CreateJob";
import JobDetails from "./pages/jobs/JobDetails";
import EditJob from "./pages/jobs/EditJob";

import Candidates from "./pages/candidates/Candidates";
import CandidateDetails from "./pages/candidates/CandidateDetails";

import MatchResults from "./pages/matching/MatchResults";
import MatchDetails from "./pages/matching/MatchDetails";
import MatchHistory from "./pages/matching/MatchHistory";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import ResumeChat from "./pages/ResumeChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTE
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* =========================
              MAIN APPLICATION LAYOUT
          ========================= */}

          <Route path="/" element={<Layout />}>

            {/* =========================
                DASHBOARD
            ========================= */}

            <Route
              index
              element={<Dashboard />}
            />

            {/* =========================
                RESUMES
            ========================= */}

            <Route
              path="resumes"
              element={<Resumes />}
            />

            <Route
              path="resumes/upload"
              element={<UploadResume />}
            />

            <Route
              path="resumes/:id"
              element={<ResumeDetails />}
            />

            <Route
              path="resumes/:id/analysis"
              element={<ResumeAnalysis />}
            />

            {/* =========================
                JOBS
            ========================= */}

            <Route
              path="jobs"
              element={<Jobs />}
            />

            <Route
              path="jobs/create"
              element={<CreateJob />}
            />

            {/* Edit Job */}
            <Route
              path="jobs/:id/edit"
              element={<EditJob />}
            />

            {/* Job Details */}
            <Route
              path="jobs/:id"
              element={<JobDetails />}
            />

            {/* =========================
                CANDIDATES
            ========================= */}

            <Route
              path="candidates"
              element={<Candidates />}
            />

            <Route
              path="candidates/:id"
              element={<CandidateDetails />}
            />

            {/* =========================
                MATCHING
            ========================= */}

            <Route
              path="matching"
              element={<MatchResults />}
            />

            <Route
              path="matching/:jobId/:resumeId"
              element={<MatchDetails />}
            />

            <Route
              path="matching/history"
              element={<MatchHistory />}
            />

            {/* =========================
                SETTINGS
            ========================= */}

            <Route
              path="settings"
              element={<Settings />}
            />

            {/* =========================
                NOT FOUND
            ========================= */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Route>

          {/* =========================
              AI RESUME CHAT
          ========================= */}

          <Route
            path="/resume-chat/:resumeId"
            element={<ResumeChat />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;