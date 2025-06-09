import React, { useState } from "react";
import "../css/VictimsByCase.css";

const VictimsByCase = () => {
  const [caseId, setCaseId] = useState("");
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVictims = async () => {
    setLoading(true);
    setError("");
    setVictims([]);

    try {
      const res = await fetch(`http://localhost:8000/victims/case/${caseId}`);
      if (!res.ok) throw new Error("فشل في جلب الضحايا");
      const data = await res.json();
      setVictims(data);
    } catch (err) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="victims-case-container">
      <h2>📂 استعلام عن الضحايا المرتبطين بالقضية</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="أدخل رقم القضية"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        />
        <button onClick={fetchVictims}>بحث</button>
      </div>

      {loading && <p>🔄 جاري التحميل...</p>}
      {error && <p className="error-msg">❌ {error}</p>}

      {victims.length > 0 && (
        <div className="victim-list">
          {victims.map((victim) => (
            <div key={victim._id} className="victim-card">
              <h3>🔹 ضحية رقم {victim._id}</h3>
              <p>
                <strong>نوع:</strong> {victim.type}
              </p>
              <p>
                <strong>مجهول الهوية؟</strong> {victim.anonymous ? "نعم" : "لا"}
              </p>

              <h4>📋 معلومات سكانية</h4>
              <p>
                <strong>العمر:</strong> {victim.demographics?.age}
              </p>
              <p>
                <strong>الجنس:</strong> {victim.demographics?.gender}
              </p>
              <p>
                <strong>الأصل:</strong>{" "}
                {victim.demographics?.ethnicity || "غير معروف"}
              </p>
              <p>
                <strong>العمل:</strong>{" "}
                {victim.demographics?.occupation || "غير معروف"}
              </p>

              <h4>📞 معلومات التواصل</h4>
              <p>
                <strong>الإيميل:</strong> {victim.contact_info?.email || "N/A"}
              </p>
              <p>
                <strong>الهاتف:</strong> {victim.contact_info?.phone || "N/A"}
              </p>
              <p>
                <strong>رسائل مشفرة:</strong>{" "}
                {victim.contact_info?.secure_messaging || "N/A"}
              </p>

              <h4>🧾 القضايا المرتبط بها</h4>
              <p>{victim.cases_involved?.join(", ") || "لا يوجد"}</p>

              <h4>⚠️ تقييم الخطر</h4>
              <p>
                <strong>المستوى:</strong> {victim.risk_assessment?.level}
              </p>
              <p>
                <strong>التهديدات:</strong>{" "}
                {victim.risk_assessment?.threats?.join(", ") || "لا يوجد"}
              </p>
              <p>
                <strong>يحتاج حماية؟</strong>{" "}
                {victim.risk_assessment?.protection_needed ? "نعم" : "لا"}
              </p>

              <h4>🛡️ خدمات الدعم</h4>
              {victim.support_services?.length > 0 ? (
                <ul>
                  {victim.support_services.map((s, idx) => (
                    <li key={idx}>
                      {s.type} - {s.provider || "غير معروف"} (
                      {s.status || "غير محدد"})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>لا يوجد خدمات مسجلة.</p>
              )}

              <h4>⏱️ الطوابع الزمنية</h4>
              <p>
                <strong>تم الإنشاء:</strong>{" "}
                {new Date(victim.created_at).toLocaleString()}
              </p>
              <p>
                <strong>آخر تعديل:</strong>{" "}
                {new Date(victim.updated_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !victims.length && caseId && !error && (
        <p className="no-results">🚫 لا يوجد ضحايا لهذه القضية.</p>
      )}
    </div>
  );
};

export default VictimsByCase;
