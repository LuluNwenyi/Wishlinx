import React from "react";

const FullScreenLoader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
