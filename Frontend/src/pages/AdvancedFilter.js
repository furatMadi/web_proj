import React, { useState } from "react";
const AdvancedFilter = ({ onFilter }) => {
  // states and handlers
  const [location, setLocation] = useState("");
  const [caseName, setCaseName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    onFilter({ location, caseName }); // إرسال البيانات للتصفية
  };
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // دالة التعامل مع التغيير في الـ caseName
  const handleCaseNameChange = (e) => {
    setCaseName(e.target.value);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <label style={{ flex: "1 1 200px" }}>
          Location:
          <select
            style={{ width: "100%", padding: "0.5rem" }}
            value={location}
            onChange={handleLocationChange}
          >
            <option value="">Select Location</option>
            <option value="Gaza">Gaza</option>
            <option value="West Bank">West Bank</option>
            {/* خيارات أخرى */}
          </select>
        </label>

        <label style={{ flex: "1 1 200px" }}>
          Case Name:
          <input
            style={{ width: "100%", padding: "0.5rem" }}
            type="text"
            value={caseName}
            onChange={handleCaseNameChange}
            placeholder="Enter case name"
          />
        </label>

        {/* عناصر أخرى بنفس النمط */}

        <button
          type="submit"
          style={{
            padding: "0.7rem 1.5rem 0rem 2rem",
            margin: "0rem 0rem 0rem 3rem",
          }}
        >
          Filter
        </button>
      </form>
    </div>
  );
};

export default AdvancedFilter;
