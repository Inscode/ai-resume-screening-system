import axiosPublic from "./axiosPublic";

export const getJobs = async () => {
  const res = await axiosPublic.get("/jobs");
  return res.data;
};

export const getOneJob = async (jobId) => {
  const res = await axiosPublic.get(`/jobs/${jobId}`);
  return res.data;
};

export const uploadApplication = async (formData) => {
  const res = await axiosPublic.post("/candidates/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};
