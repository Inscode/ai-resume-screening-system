import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  FileText,
  Download,
  Search,
  Filter,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { getAllCandidates, createJob } from "../api/adminService";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await getAllCandidates();
        setCandidates(response);
      } catch (err) {
        console.error("Error fetching candidates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.job?.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterScore === "all" ||
      (filterScore === "high" && c.matchScore >= 70) ||
      (filterScore === "medium" && c.matchScore >= 40 && c.matchScore < 70) ||
      (filterScore === "low" && c.matchScore < 40);

    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score) => {
    if (score >= 70)
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 40)
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const getScoreBadge = (score) => {
    if (score >= 70) return { label: "Excellent", color: "emerald" };
    if (score >= 40) return { label: "Good", color: "orange" };
    return { label: "Fair", color: "red" };
  };

  const stats = {
    total: candidates.length,
    highMatch: candidates.filter((c) => c.matchScore >= 70).length,
    avgScore:
      candidates.length > 0
        ? (
            candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) /
            candidates.length
          ).toFixed(1)
        : 0,
  };

  const handleJobs = () => {
    navigate("/admin/jobs");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
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
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl text-white font-medium">
              <Users className="w-5 h-5" />
              <span>Candidates</span>
            </button>
            <button
              onClick={handleJobs}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition"
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </button>
          </nav>

          {/* Logout */}
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
              <h1 className="text-2xl font-bold text-white">
                Candidate Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.total}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">
                Total Candidates
              </h3>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.highMatch}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">
                High Match (≥70%)
              </h3>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stats.avgScore}%
                </span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">
                Average Match Score
              </h3>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none cursor-pointer"
                >
                  <option value="all">All Candidates</option>
                  <option value="high">High Match (≥70%)</option>
                  <option value="medium">Medium Match (40-69%)</option>
                  <option value="low">Low Match (&lt;40%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Loading candidates...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-xl text-slate-400">No candidates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left p-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        Candidate
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        Job Title
                      </th>
                      <th className="text-center p-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        Match Score
                      </th>
                      <th className="text-center p-4 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        Resume
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((c, idx) => {
                      const badge = getScoreBadge(c.matchScore || 0);
                      return (
                        <tr
                          key={c.id}
                          className="border-b border-slate-700/30 hover:bg-slate-800/30 transition"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                                {c.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white font-medium">
                                  {c.fullName}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {c.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-300">
                                {c.job?.title || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center gap-2">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getScoreColor(
                                  c.matchScore || 0
                                )}`}
                              >
                                {(c.matchScore || 0).toFixed(1)}%
                              </span>
                              <span
                                className={`text-xs font-medium text-${badge.color}-400`}
                              >
                                {badge.label}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <a
                              href={`http://localhost:8080/${c.resumeUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg text-blue-400 hover:text-blue-300 transition text-sm font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && filteredCandidates.length > 0 && (
            <div className="mt-4 text-center text-sm text-slate-500">
              Showing {filteredCandidates.length} of {candidates.length}{" "}
              candidates
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
