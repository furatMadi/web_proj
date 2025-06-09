import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("الدور المخزن قبل تسجيل الخروج: ", storedRole);

    // إزالة بيانات المستخدم عند تحميل الصفحة
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    // إعادة التوجيه إلى صفحة تسجيل الدخول
    navigate("/");
  }, [navigate]);

  return (
    <div className="logout-container" dir="rtl">
      <h2>جارٍ تسجيل الخروج...</h2>
    </div>
  );
};

export default LogoutPage;
