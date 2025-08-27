import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskPage from "./Home/Task";
// import TaskLog from "./components/TaskLog";
// import ActivityLog from "./components/TaskActivityLog";



const App: React.FC = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskPage />} />
        {/* <Route path="/a" element={<ActivityLog />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
