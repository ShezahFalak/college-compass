import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaCalendarAlt, FaClipboardList, FaChartBar, FaStickyNote } from "react-icons/fa";
import Timetable from "./timetable";
import {signOut} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";


const Dashboard = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);
  const handleSignOut=async ()=>{
      try{
        await signOut(auth);
        alert("Signed out successfully");
        navigate("/");
      }
      catch(error){
        alert("Could not sign out");
      }
    };
  

  const cards = [
    { title: "Timetable", route: "/timetable", icon: <FaCalendarAlt /> },
    { title: "Assignments", route: "/assignments", icon: <FaClipboardList /> },
    { title: "Scores", route: "/scores", icon: <FaChartBar /> },
    { title: "Attendance", route: "/attendance", icon: <FaStickyNote /> },
  ];

  return (
    <div className={`dashboard-page ${fadeIn ? "fade-in" : ""}`}>
      <div style={{ position: "relative", marginTop: "0rem", marginBottom: "2rem" }}>
  <h2 style={{ textAlign: "center", margin: 0 }} className="heading">
    Welcome to College Compass
  </h2>
  <button
    onClick={handleSignOut}
    style={{
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
    }}
    className="btn btn-outline-danger"
  >
    Sign Out
  </button>
</div>

      <div className="container mt-5">
  

  <div className="row g-4 justify-content-center">

    <div className="col-md-5 col-sm-12">
      <div className="timetable">
        <img className="dbimg"
          src="https://i.pinimg.com/originals/73/ab/db/73abdb249d57129e6750f9c0240d8fec.png"
          alt="Timetable" />
        <button className="dbbtn" onClick={() => navigate("/timetable")}>
          <FaCalendarAlt style={{marginRight:"5px"}}></FaCalendarAlt>Timetable</button>
      </div>
    </div>

    <div className="col-md-5 col-sm-12">
      <div className="scores">
        <img className="dbimg"
          src="https://tse2.mm.bing.net/th/id/OIP.xKBVXf0gbRIhulDOzV-mzQHaE5?rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Scores" />
        <button className="dbbtn" onClick={() => navigate("/scores")}>
          <FaChartBar style={{marginRight:"5px"}}></FaChartBar>Scores</button>
      </div>
    </div>

    <div className="col-md-5 col-sm-12">
      <div className="assign">
        <img className="dbimg"
          src="https://i.pinimg.com/736x/e1/6d/47/e16d478e2a1f789df93e2698d17aeb22.jpg"  
          alt="Assignments" />
        <button className="dbbtn" onClick={() => navigate("/assignments")}>
           <FaClipboardList style={{ marginRight: "5px" }} />Assignments</button>
      </div>
    </div>

    <div className="col-md-5 col-sm-12">
      <div className="notes">
        <img className="dbimg"
          src="https://media.istockphoto.com/id/1469905151/photo/rear-view-of-large-group-of-students-on-a-class-at-lecture-hall.jpg?s=612x612&w=0&k=20&c=ErWYF3hhPwIjrA924EvHllOvw66SYLOTugtZHEURVq8="
          alt="attendance" />
        <button className="dbbtn" onClick={() => navigate("/attendance")}>
          <FaStickyNote style={{ marginRight: "5px" }} />
          Attendance Tracker</button>
        
      </div>
    </div>
 
    

  </div>
</div>
</div>

  );
};

export default Dashboard;


