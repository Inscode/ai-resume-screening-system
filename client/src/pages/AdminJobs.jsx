import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  X,
  LogOut,
  Menu,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createJob, deleteJob, getJobs, updateJob } from "../api/adminService";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    employmentType: "Full-Time",
    minSalary: "",
    maxSalary: "",
    applicationDeadline: "",
  });

  const handleEditJob = (job) => {
    setEditingJob(job);

    setFormData({
      title: job.title,
      description: job.description,
      skillsRequired: job.skillsRequired,
      employmentType: job.employmentType,
      minSalary: job.minSalary.toString(),
      maxSalary: job.maxSalary.toString(),
      applicationDeadline: job.applicationDeadline,
    });
    setShowEditModal(true);
  };

  const handleUpdateJob = async () => {
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired,
        employmentType: formData.employmentType,
        minSalary: parseFloat(formData.minSalary),
        maxSalary: parseFloat(formData.maxSalary),
        applicationDeadline: formData.applicationDeadline,
      };

      await updateJob(editingJob.id, jobData);

      setShowEditModal(false);
      setEditingJob(null);
      setFormData({
        title: "",
        description: "",
        skillsRequired: "",
        employmentType: "Full-Time",
        minSalary: "",
        maxSalary: "",
        applicationDeadline: "",
      });
      fetchJobs();
    } catch (err) {
      console.error("Error updating job", err);
      alert("Failed to update job");
    }
  };

  useEffect(() => {
    fetchJobs();
    setLoading(false);
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const handleCreateJob = async () => {
    try {
      const jobData = {
        ...formData,
        minSalary: parseFloat(formData.minSalary),
        maxSalary: parseFloat(formData.maxSalary),
      };

      await createJob(jobData);

      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        skillsRequired: "",
        employmentType: "Full-Time",
        minSalary: "",
        maxSalary: "",
        applicationDeadline: "",
      });
      fetchJobs();
    } catch (err) {
      console.error("Error creating job", err);
      alert("Failed to create job");
    }
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteJob(jobToDelete.id);
      setShowDeleteModal(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job", err);
      alert("Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (min, max) => {
    return `LKR ${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCandidates = () => {
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      "Full-Time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "Part-Time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Contract: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Remote: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
    return styles[type] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={handleCandidates}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition"
            >
              <Users className="w-5 h-5" />
              <span>Candidates</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl text-white font-medium">
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Jobs Management</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Job</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {jobs.length}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Total Jobs</h3>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {
                    jobs.filter(
                      (j) => new Date(j.applicationDeadline) > new Date()
                    ).length
                  }
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">
                Active Jobs
              </h3>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {jobs.filter((j) => j.employmentType === "Full-Time").length}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">
                Full-Time Positions
              </h3>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-xl text-slate-400">No jobs found</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {job.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getEmploymentTypeBadge(
                          job.employmentType
                        )}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {job.employmentType}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-300">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm">
                        {formatSalary(job.minSalary, job.maxSalary)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">
                        Deadline: {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired
                      .split(",")
                      .slice(0, 3)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-700/30 border border-slate-600/30 rounded text-slate-300 text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    {job.skillsRequired.split(",").length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/30 border border-slate-600/30 rounded text-slate-400 text-xs">
                        +{job.skillsRequired.split(",").length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Job</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the role..."
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Required Skills * (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsRequired}
                  onChange={(e) =>
                    setFormData({ ...formData, skillsRequired: e.target.value })
                  }
                  placeholder="e.g. Java, Spring Boot, PostgreSQL"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationDeadline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Min Salary (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, minSalary: e.target.value })
                    }
                    placeholder="80000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Max Salary (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.maxSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, maxSalary: e.target.value })
                    }
                    placeholder="120000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJob}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition"
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Job</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingJob(null);
                  setFormData({
                    title: "",
                    description: "",
                    skillsRequired: "",
                    employmentType: "Full-Time",
                    minSalary: "",
                    maxSalary: "",
                    applicationDeadline: "",
                  });
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the role..."
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Required Skills * (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsRequired}
                  onChange={(e) =>
                    setFormData({ ...formData, skillsRequired: e.target.value })
                  }
                  placeholder="e.g. Java, Spring Boot, PostgreSQL"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationDeadline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Min Salary (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, minSalary: e.target.value })
                    }
                    placeholder="80000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Max Salary (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.maxSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, maxSalary: e.target.value })
                    }
                    placeholder="120000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                    setFormData({
                      title: "",
                      description: "",
                      skillsRequired: "",
                      employmentType: "Full-Time",
                      minSalary: "",
                      maxSalary: "",
                      applicationDeadline: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateJob}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition"
                >
                  Update Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/20 rounded-3xl p-8 max-w-md w-full">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Delete Job?
            </h2>

            {/* Message */}
            <p className="text-slate-400 text-center mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-white font-semibold text-center mb-6">
              "{jobToDelete?.title}"?
            </p>

            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-400 text-center">
                This action cannot be undone. All applications for this job will
                also be affected.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
