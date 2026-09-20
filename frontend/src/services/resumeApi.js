import API from "./api";

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post(
    "/resumes/upload",
    formData
  );

  return response.data;
};

export const getResumes = async () => {
  const response = await API.get("/resumes/");
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await API.get(`/resumes/${id}`);
  return response.data;
};