import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import MonitoringPage from "./MonitoringPage"; // Rename your file monitoring App.js to MonitoringPage.js

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Routes>
    </Router>
  );
};

export default App;

