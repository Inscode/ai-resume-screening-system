import axiosInstance from "./axiosInstance";

export const getJobs = async () => {
  const res = await axiosInstance.get("/jobs");
  return res.data;
};

export const getOneJob = async (jobId) => {
  const res = await axiosInstance.get(`/jobs/${jobId}`);
  return res.data;
};

export const uploadApplication = async (formData) => {
  const res = await axiosInstance.post("/candidates/upload",formData, {
    headers: {"Content-Type": "multipart/form-data"},
  });
  return res;
};
