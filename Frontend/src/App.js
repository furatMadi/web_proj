import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Analyst from './pages/Analyst';
import Organization from './pages/Organization';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/analyst" element={<Analyst />} />
      <Route path="/organization" element={<Organization />} />
    </Routes>
  );
}

export default App;
