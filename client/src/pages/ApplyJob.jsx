import { useState, useEffect } from "react";
import {
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneJob, uploadApplication } from "../api/userService";

export default function ApplyJob() {
  // For demo, using hardcoded jobId. Replace with: const { jobId } = useParams();
  const { jobId } = useParams();

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch job details
  //   fetch(`http://localhost:8080/api/jobs/${jobId}`)
  //     .then((res) => res.json())
  //     .then((data) => setJob(data))
  //     .catch((err) => console.error(err));
  // }, [jobId]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getOneJob(jobId);
        setJob(response);
      } catch (err) {
        console.error("Error fetching job", err);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone || !file) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobId", jobId);
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    // try {
    //   const response = await fetch(
    //     "http://localhost:8080/api/candidates/upload",
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );

    //   if (response.ok) {
    //     setIsSuccess(true);
    //     setTimeout(() => {
    //       window.location.href = "/";
    //     }, 2500);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert("Failed to submit application. Please try again.");
    // } finally {
    //   setIsSubmitting(false);
    // }

    try {
      const res = await uploadApplication(formData);
      if (res.status === 200) {
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (err) {
      console.error("Error submitting application", err);
      alert("Failed to submit application, Please Try Again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = (min, max) => {
    return `LKR ${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K`;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Application Submitted!
            </h2>
            <p className="text-slate-400 mb-2">Thank you for applying.</p>
            <p className="text-sm text-slate-500">
              Redirecting you back to jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Back to Jobs</span>
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Job Info Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {job?.title || "Software Engineer"}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {job?.employmentType || "Full-Time"}
                  </p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
                  About the Role
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {job?.description ||
                    "We are looking for a skilled Java Spring Boot developer to build and maintain backend services for our enterprise application."}
                </p>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Salary Range</div>
                    <div className="text-sm font-semibold text-white">
                      {job
                        ? formatSalary(job.minSalary, job.maxSalary)
                        : "LKR 80K - 120K"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Deadline</div>
                    <div className="text-sm font-semibold text-white">
                      {job?.applicationDeadline
                        ? new Date(job.applicationDeadline).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )
                        : "Dec 15, 2025"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(
                    job?.skillsRequired ||
                    "Java, Spring Boot, REST APIs, PostgreSQL, Docker, AWS"
                  )
                    .split(",")
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Apply for Position
                </h1>
                <p className="text-slate-400">
                  Fill in your details and upload your resume
                </p>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Resume / CV *
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition ${
                      dragActive
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700/50 bg-slate-900/30"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center pointer-events-none">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {file ? (
                          <FileText className="w-8 h-8 text-blue-400" />
                        ) : (
                          <Upload className="w-8 h-8 text-slate-500" />
                        )}
                      </div>
                      {file ? (
                        <div>
                          <p className="text-white font-medium mb-1">
                            {file.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white font-medium mb-1">
                            Drop your resume here or click to browse
                          </p>
                          <p className="text-sm text-slate-500">
                            Supports PDF, DOC, DOCX (Max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {file && (
                    <button
                      onClick={() => setFile(null)}
                      className="text-sm text-blue-400 hover:text-blue-300 mt-2"
                    >
                      Remove file
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !file ||
                    !form.fullName ||
                    !form.email ||
                    !form.phone
                  }
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500">
                  By submitting, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
