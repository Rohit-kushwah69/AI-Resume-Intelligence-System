import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="resumes" element={<Resumes />} />
          <Route path="resumes/upload" element={<UploadResume />} />
          <Route path="resumes/:id" element={<ResumeDetails />} />
          <Route path="resumes/:id/analysis" element={<ResumeAnalysis />} />

          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id" element={<JobDetails />} />

          <Route path="candidates" element={<Candidates />} />
          <Route path="candidates/:id" element={<CandidateDetails />} />

          <Route path="matching" element={<MatchResults />} />
          <Route path="matching/:jobId/:resumeId" element={<MatchDetails />} />
          <Route path="matching/history" element={<MatchHistory />}
/>
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;