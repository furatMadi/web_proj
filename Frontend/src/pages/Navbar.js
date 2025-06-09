import React from "react";
import AdminNav from "./AdminNav";
import OrganizationNav from "./organizationBar";
import AnalystNav from "../components/AnalystNav";
import DefaultNav from "./DefaultNav";

const Navbar = () => {
  const role = localStorage.getItem("role");

  if (!role || role === "default") return <DefaultNav />;

  switch (role.toLowerCase()) {
    case "admin":
      return <AdminNav />;
    case "organization":
      return <OrganizationNav />;
    case "analyst":
      return <AnalystNav />;
    default:
      return <DefaultNav />; 
  }
};

export default Navbar;
