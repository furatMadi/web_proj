import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import AdvancedFilter from "./AdvancedFilter";

const SearchPage = () => {
  const [filterCriteria, setFilterCriteria] = useState({});

  const handleFilter = (criteria) => {
    setFilterCriteria(criteria);
    // من هنا تستدعي API أو تعالج البيانات حسب الحاجة
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Search and Filter Data
        </h1>
        <AdvancedFilter onFilter={handleFilter} />
        {/* هنا تعرض النتائج بشكل مرتب */}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
