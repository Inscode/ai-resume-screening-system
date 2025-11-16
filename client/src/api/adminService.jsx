import axiosPublic from "./axiosPublic";
import axiosPrivate from "./axiosPrivate";

export const adminLogin = async (credentials) => {
  const res = await axiosPublic.post("/admin/login", credentials);
  return res.data;
};

export const getAllCandidates = async () => {
  const res = await axiosPrivate.get("/candidates");
  return res.data;
};

export const getJobs = async () => {
  const res = await axiosPublic.get("/jobs");
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await axiosPrivate.delete(`/jobs/${jobId}`);
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await axiosPrivate.post("/jobs", jobData);
  return res.data;
};

export const updateJob = async (jobId, jobData) => {
  const res = await axiosPrivate.put(`/jobs/${jobId}`, jobData);
  return res.data;
};

export const viewResume = async (resumeUrl) => {
  const cleanUrl = resumeUrl.replace("uploads/", "");
  const response = await axiosPrivate.get(`/files/resume/${cleanUrl}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  window.open(url, "_blank");

  return response.data;
};
