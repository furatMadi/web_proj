import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminCases from "./AdminCases";
// استيراد الصفحات الأخرى حسب الحاجة

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cases" element={<AdminCases />} />
        {/* أضف المزيد من الصفحات */}
      </Routes>
    </Router>
  );
}

export default App;
