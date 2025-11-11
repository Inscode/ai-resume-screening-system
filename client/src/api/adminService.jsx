import axiosInstance from "./axiosInstance";

export const adminLogin = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export const getAllCandidates = async () => {
  const res = await axiosInstance.get("/candidates");
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await axiosInstance.post("/jobs", jobData);
  return res.data;
};
