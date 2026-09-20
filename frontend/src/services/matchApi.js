import API from "./api";

// Match a resume with a job
export const matchResumeWithJob = async (jobId, resumeId) => {
  const response = await API.get(
    `/jobs/match/${jobId}/${resumeId}`
  );

  return response.data;
};

// Save job match result
export const saveJobMatch = async (jobId, resumeId) => {
  const response = await API.post(
    `/jobs/match/save/${jobId}/${resumeId}`
  );

  return response.data;
};

// Get match history for a resume
export const getMatchHistory = async (resumeId) => {
  const response = await API.get(
    `/jobs/match/history/${resumeId}`
  );

  return response.data;
};