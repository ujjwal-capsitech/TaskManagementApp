import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskPage from "./Home/Task";


const App: React.FC = () => {


  return (
      <Router>
        <Routes>
                <Route path="/" element={<TaskPage />} />
        </Routes>
      </Router>

  );
};

export default App;
