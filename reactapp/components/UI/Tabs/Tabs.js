// Tabs.js
import React, { useState } from "react";
import "./tabs.css";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;