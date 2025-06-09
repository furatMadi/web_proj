<<<<<<< HEAD
import AnalystDashboard from './pages/AnalystDashboard.js'; 
import DetailedView from './pages/DetailedView';
import GeoInsights from './pages/GeoInsights';
import ReportPage from './pages/ReportPage';
import { Routes, Route } from "react-router-dom";
=======
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AnalystDashboard from "./pages/AnalystDashboard.js";
import DetailedView from "./pages/DetailedView";
import GeoInsights from "./pages/GeoInsights";
import ReportPage from "./pages/ReportPage";
// import { Routes, Route } from "react-router-dom";
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Analyst from "./pages/Analyst";
import Organization from "./pages/Organization";
<<<<<<< HEAD
//import VictimDetails from "./pages/VictimDetails";
import "./pages/addReport"
=======
import VictimDetails from "./pages/VictimDetails.js";
import "./pages/addReport";
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
import SearchPage from "./pages/SearchPage";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCases from "./pages/AdminCases";
import AddReport from "./pages/addReport";
import "leaflet/dist/leaflet.css";
import AnalyticsPage from "./pages/organizationAnalytics";

<<<<<<< HEAD
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="/analystDashboard" element={<AnalystDashboard />} />
      <Route path="/detailed" element={<DetailedView />} />
      <Route path="/geo" element={<GeoInsights />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/organization" element={<Organization />} />
      <Route path="/analyst" element={<Analyst />} />
      <Route path="/organization" element={<Organization />} />
      <Route path="/SearchPage" element={<SearchPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/admindashborder" element={<AdminDashboard />} />
      <Route path="/admin/cases" element={<AdminCases />} />
      <Route path="/addReport" element={<AddReport />} />
      <Route path="/analytics" element={<AnalyticsPage />} />


      {/* <Route path="/victim/:victimId" element={<VictimDetails />}/> */}
    </Routes>
=======
import AddVictim from "./pages/AddVictim";
import VictimRiskHistory from "./pages/VictimRiskHistory";
import UpdateRiskLevel from "./pages/UpdateRiskLevel";
import VictimsByCase from "./pages/VictimsByCase";
import VictimTools from "./pages/VictimTools";
import RiskTrends from "./pages/RiskTrends";
// import AnalystTools from "./pages/AnalystTools";
import AnalystTools from "./pages/AnalystTools";
import AdminCaseTools from "./pages/AdminCaseTools";
import IncidentReportTools from "./pages/IncidentReportTools";

import DefaultNav from "./pages/DefaultNav.js"; // ✅ بدل "./Navbar"
import LogoutPage from "./pages/LogoutPage";
import Navbar from "./pages/Navbar.js";
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // قائمة بالمسارات التي لا يجب أن يظهر فيها شريط التنقل
  const hideNavbarRoutes = ["/login", "/register"];

  // حالة لتخزين الدور (role)
  const [role, setRole] = useState(null);

  useEffect(() => {
    const updateRole = () => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    };

    // جلب الدور عند تحميل الصفحة
    updateRole();

    // مراقبة أي تغيير في `localStorage`
    window.addEventListener("storage", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
    };
  }, [location.pathname]);

  // const handleLogout = () => {
  //   localStorage.removeItem("role"); // مسح الدور عند تسجيل الخروج
  //   setRole(null); // تحديث الحالة
  //   navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
  // };

  // التحقق مما إذا كان يجب عرض شريط التنقل أم لا
  const showNavbar = role && !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      <div>{<Navbar />}
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/analystDashboard" element={<AnalystDashboard />} />
        <Route path="/detailed" element={<DetailedView />} />
        <Route path="/geo" element={<GeoInsights />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/analyst" element={<Analyst />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/SearchPage" element={<SearchPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admindashborder" element={<AdminDashboard />} />
        <Route path="/admin/cases" element={<AdminCases />} />
        <Route path="/addReport" element={<AddReport />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        {/* <Route path="/victim/:victimId" element={<VictimDetails />} /> */}
        <Route path="/victim-details" element={<VictimDetails />} />
        <Route path="/add-victim" element={<AddVictim />} />
        <Route path="/victim-risk-history" element={<VictimRiskHistory />} />
        <Route
          path="/victims/update-risk/:victimId"
          element={<UpdateRiskLevel />}
        />

        <Route path="/victims-by-case" element={<VictimsByCase />} />
        <Route path="/victim-tools" element={<VictimTools />} />
        <Route path="/risk-trends" element={<RiskTrends />} />

        <Route path="/analyst-tools" element={<AnalystTools />} />
        <Route path="/case-tools" element={<AdminCaseTools />} />
        <Route path="/incident-tools" element={<IncidentReportTools />} />
        <Route path="/DefaultNav" element={<DefaultNav></DefaultNav>} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </div>
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
  );
}

export default App;
