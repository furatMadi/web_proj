import AnalystDashboard from "./pages/AnalystDashboard.js";
import DetailedView from "./pages/DetailedView";
import GeoInsights from "./pages/GeoInsights";
import ReportPage from "./pages/ReportPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Analyst from "./pages/Analyst";
import Organization from "./pages/Organization";
import VictimDetails from "./pages/VictimDetails.js";
import "./pages/addReport";
import SearchPage from "./pages/SearchPage";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCases from "./pages/AdminCases";
import AddReport from "./pages/addReport";
import "leaflet/dist/leaflet.css";
import AnalyticsPage from "./pages/organizationAnalytics";

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
      <Route path="/admin/case-tools" element={<AdminCaseTools />} />
      <Route path="/incident-tools" element={<IncidentReportTools />} />
    </Routes>
  );
}

export default App;
