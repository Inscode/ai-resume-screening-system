import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import ApplyJob from "./pages/ApplyJob";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminJobs from "./pages/AdminJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/apply/:jobId" element={<ApplyJob/>}></Route>
        <Route path="/admin/login" element={<AdminLogin/>}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/admin/jobs" element={<AdminJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
