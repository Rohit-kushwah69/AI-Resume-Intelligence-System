import API from "./api";

// Get all jobs
export const getJobs = async () => {
  const response = await API.get("/jobs/");
  return response.data;
};

// Get single job
export const getJobById = async (id) => {
  const response = await API.get(`/jobs/${id}`);
  return response.data;
};

// Create new job
export const createJob = async (jobData) => {
  const response = await API.post("/jobs/", jobData);
  return response.data;
};

// Count 
export const getMatchCount = async () => {
  const response = await API.get("/jobs/match/count");
  return response.data;
};

// delete
export const deleteJob = async (id) => {
  const response = await API.delete(`/jobs/${id}`);
  return response.data;
};