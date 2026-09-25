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

import Candidates from "./pages/candidates/Candidates";
import CandidateDetails from "./pages/candidates/CandidateDetails";

import MatchResults from "./pages/matching/MatchResults";
import MatchDetails from "./pages/matching/MatchDetails";
import MatchHistory from "./pages/matching/MatchHistory";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";


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

          <Route path="/" element={<Layout />}>

            {/* Dashboard */}

            <Route
              index
              element={<Dashboard />}
            />


            {/* Resumes */}

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


            {/* Jobs */}

            <Route
              path="jobs"
              element={<Jobs />}
            />

            <Route
              path="jobs/create"
              element={<CreateJob />}
            />

            <Route
              path="jobs/:id"
              element={<JobDetails />}
            />


            {/* Candidates */}

            <Route
              path="candidates"
              element={<Candidates />}
            />

            <Route
              path="candidates/:id"
              element={<CandidateDetails />}
            />


            {/* Matching */}

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


            {/* Settings */}

            <Route
              path="settings"
              element={<Settings />}
            />


            {/* Not Found */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;