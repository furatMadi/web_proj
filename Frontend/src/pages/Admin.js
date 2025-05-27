// import React, { useEffect, useState } from "react";

// function Admin() {
//   const [reports, setReports] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // مؤقتًا معلّق جلب التقارير من السيرفر
//     // fetch("http://localhost:8000/reports/pending")
//     //   .then((res) => res.json())
//     //   .then((data) => setReports(data))
//     //   .catch((err) => setMessage("Failed to load reports"));

//     // مثال بيانات dummy لتشغيل الشكل بدون API
//     setReports([
//       {
//         _id: "1",
//         incident_details: {
//           description: "Sample incident 1",
//           location: { city: "CityA", country: "CountryA" },
//           date: new Date().toISOString(),
//         },
//       },
//       {
//         _id: "2",
//         incident_details: {
//           description: "Sample incident 2",
//           location: { city: "CityB", country: "CountryB" },
//           date: new Date().toISOString(),
//         },
//       },
//     ]);
//   }, []);

//   // مؤقتًا dummy function لتعليق الدالة الحقيقية
//   const handleReview = (reportId, action) => {
//     console.log(`Reviewing report ${reportId} with action ${action}`);
//     setMessage(`Report ${action} successfully (dummy)`);
//     setReports((prev) => prev.filter((r) => r._id !== reportId));
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Admin Dashboard</h1>
//       <p>Welcome, Admin! Review pending reports below:</p>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//       {reports.length === 0 ? (
//         <p>No pending reports.</p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th style={{ border: "1px solid #ccc", padding: "8px" }}>
//                 Description
//               </th>
//               <th style={{ border: "1px solid #ccc", padding: "8px" }}>
//                 Location
//               </th>
//               <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
//               <th style={{ border: "1px solid #ccc", padding: "8px" }}>
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.map((report) => (
//               <tr key={report._id}>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   {report.incident_details?.description}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   {report.incident_details?.location?.city},{" "}
//                   {report.incident_details?.location?.country}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   {new Date(report.incident_details?.date).toLocaleDateString()}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//                   <button
//                     onClick={() => handleReview(report._id, "accepted")}
//                     style={{ marginRight: "8px" }}
//                   >
//                     Accept
//                   </button>
//                   <button onClick={() => handleReview(report._id, "rejected")}>
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default Admin;

import React, { useEffect, useState } from "react";

function Admin() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/reports/pending")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => setMessage("Failed to load reports"));
  }, []);

  const handleReview = async (reportId, action) => {
    const reviewed_by = "admin123"; // 🔒 استبدلها بـ ID فعلي لاحقًا
    const payload = {
      status: action,
      reviewed_by: reviewed_by,
    };
    try {
      const res = await fetch(
        `http://localhost:8000/reports/review/${reportId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(`Report ${action} successfully`);
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      } else {
        setMessage(data.detail || "Error reviewing report");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Review pending reports below:</p>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {reports.length === 0 ? (
        <p>No pending reports.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Location
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {report.incident_details?.description}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {report.incident_details?.location?.city},{" "}
                  {report.incident_details?.location?.country}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {new Date(report.incident_details?.date).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleReview(report._id, "accepted")}
                    style={{ marginRight: "8px" }}
                  >
                    Accept
                  </button>
                  <button onClick={() => handleReview(report._id, "rejected")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
