import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Award,
  MapPin,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { getJobs } from "../api/userService";

export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/jobs")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch jobs");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setJobs(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getJobs();
        setJobs(response);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skillsRequired.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (min, max) => {
    return `LKR ${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K`;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>New Opportunities Daily</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-white">Find Your Next</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Connect with leading companies and take the next step in your
              career journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition" />
                <input
                  type="text"
                  placeholder="Search by title, skills, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition shadow-xl shadow-black/20"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {jobs.length}
                </div>
                <div className="text-slate-500 text-sm font-medium mt-1">
                  Open Positions
                </div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-slate-500 text-sm font-medium mt-1">
                  Top Companies
                </div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  1K+
                </div>
                <div className="text-slate-500 text-sm font-medium mt-1">
                  Success Stories
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="relative max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 mt-4">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <Award className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-xl text-slate-400">Failed to load jobs</p>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-xl text-slate-400">
              {searchTerm
                ? "No jobs match your search"
                : "No jobs available right now"}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Check back soon for new opportunities
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredJobs.map((job) => {
              const skills = job.skillsRequired.split(",").map((s) => s.trim());

              return (
                <div
                  key={job.id}
                  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">
                            {job.title}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getEmploymentTypeBadge(
                          job.employmentType
                        )}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {job.employmentType}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="px-3 py-1.5 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-400 text-xs font-medium">
                          +{skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 rounded-lg">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          Salary Range
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="flex items-center justify-center w-8 h-8 bg-orange-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          Application Deadline
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatDate(job.applicationDeadline)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => (window.location.href = `/apply/${job.id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
