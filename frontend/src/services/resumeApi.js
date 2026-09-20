import API from "./api";

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};