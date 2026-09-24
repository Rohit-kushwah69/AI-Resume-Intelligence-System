import API from "./api";

export const loginAdmin = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};