import React from "react";

const PageLayout = ({ children }) => (
  <div className="page-layout" style={{ minHeight: "100vh", width: "100vw", overflow: "auto" }}>
    {children}
  </div>
);

export default PageLayout;
