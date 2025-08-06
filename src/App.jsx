import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Dashboard from "./components/Dashboard";
import Timetable from "./components/timetable";
import Assignment from "./components/assigments";
import Scores from "./components/scores";
import Attendance from "./components/attendance"; 

function App() {
  return (
    <Router basename="college-compass">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup />} />  
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/assignments" element={<Assignment />} />
        <Route path="/attendance" element={<Attendance />} /> 
      </Routes>
     </Router>
  );
}
export default App;
