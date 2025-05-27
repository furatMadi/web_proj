import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Analyst from "./pages/Analyst";
import Organization from "./pages/Organization";
import VictimDetails from "./pages/VictimDetails";
import SearchPage from "./pages/SearchPage";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCases from "./pages/AdminCases";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/analyst" element={<Analyst />} />
      <Route path="/organization" element={<Organization />} />
      <Route path="/SearchPage" element={<SearchPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/admindashborder" element={<AdminDashboard />} />
      <Route path="/admin/cases" element={<AdminCases />} />

      {/* <Route path="/victim/:victimId" element={<VictimDetails />}/> */}
    </Routes>
  );
}

export default App;
