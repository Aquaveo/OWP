// Tabs.js
import React, { useState } from "react";
import "./tabs.css";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index,e) => {
    e.stopPropagation(); // Prevent click event from propagating
    setActiveTab(index);
    console.log(`Tab ${index} clicked`);
  };
  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${index === activeTab ? "active" : ""}`}
            onClick={(e) => handleTabClick(index,e)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;