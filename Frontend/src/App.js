import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Analyst from './pages/Analyst';
import Organization from './pages/Organization';
import AnalystDashboard from './pages/AnalystDashboard.js'; 
import DetailedView from './pages/DetailedView';
import GeoInsights from './pages/GeoInsights';
import ReportPage from './pages/ReportPage';


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
    </Routes>
  );
}

export default App;
