
import React, { useState } from 'react';

const Tabs = ({ children, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { active: child.props.eventKey === activeKey, setActiveKey })
      )}
    </div>
  );
};

const Tab = ({ eventKey, title, children, active, setActiveKey }) => {
  if (!active) return null;

  return (
    <div>
      <button onClick={() => setActiveKey(eventKey)}>{title}</button>
      <div>{children}</div>
    </div>
  );
};

export { Tabs, Tab };