import React, { useState, useEffect } from "react";
import '../App.css';
import { NavLink } from "react-router-dom";
import { onAuthStateChanged,signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/firebaseConfig';
import {useNavigate} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";


const AttendanceTracker = () => {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [attendanceList, setAttendanceList] = useState({});

  const navigate=useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, "attendance", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAttendanceList(docSnap.data().records || {});
        }
      }
    });
    return () => unsubscribe();
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

  const markAttendance = (present) => {
    if (!subject.trim()) {
      alert("Please enter the subject name");
      return;
    }
    if (!date) {
      alert("Please select a date first");
      return;
    }
    const subjectRecords = attendanceList[subject] || {};
    const updatedSubjectRecords = { ...subjectRecords, [date]: present };
    const updatedList = { ...attendanceList, [subject]: updatedSubjectRecords };
    setAttendanceList(updatedList);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "attendance", user.uid), { records: attendanceList });
      alert("Attendance saved!");
    } catch (error) {
      console.error("Error saving attendance", error);
      alert("Failed to save attendance");
    }
  };

  

  // Calculate attendance % helper
  const getAttendancePercent = (records) => {
    const totalDays = Object.keys(records).length;
    if (totalDays === 0) return 0;
    const presentDays = Object.values(records).filter(Boolean).length;
    return ((presentDays / totalDays) * 100).toFixed(2);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-attendance">
        <span className="navbar-brand text-white"><b>College Compass</b></span>
        <div className="navbar-nav">
          <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
          <NavLink to="/timetable" className="nav-link text-white">Timetable</NavLink>
          <NavLink to="/assignments" className="nav-link text-white">Assignments</NavLink>
          <NavLink to="/scores" className="nav-link text-white">Scores</NavLink>
          <NavLink to="/attendance" className="nav-link text-black">Attendance Tracker</NavLink>
        </div>
      <button className="signout" onClick={handleSignOut}>
                    <FiLogOut size={20} className="me-2" />
                     Sign Out
                  </button> 
      </nav>
<div className="wholepage-attend">
      <div className="text-center mb-4 fs-1 fw-bold heading3">Attendance Tracker</div>
  
      <div style={{backgroundColor:"rgba(255, 252, 250, 0.48)"}} className="form-control p-3 d-flex gap-3 flex-wrap justify-content-center">
        <input  
          type="text"
          className="bg-white text-black col-md-3 input"
          placeholder="Enter Subject Name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="date"
          className="bg-white text-black col-md-3 input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => markAttendance(true)}>Mark Present</button>
        <button className="btn btn-danger" onClick={() => markAttendance(false)}>Mark Absent</button>
      </div>
      

      <div className="result mt-4">
        <h5>Attendance Records</h5>
        {Object.keys(attendanceList).length === 0 && <p>No attendance recorded yet.</p>}

        {Object.entries(attendanceList).map(([subj, records]) => {
          const percent = getAttendancePercent(records);
          return (
            <div key={subj} className="mb-3">
              <h6>
                {subj} — Attendance: {percent}%
                {percent < 75 && (
                  <span style={{ color: "red", marginLeft: 10 }}>
                    ⚠️ Attendance below 75%!
                  </span>
                )}
              </h6>
              <ul>
                {Object.entries(records).map(([recDate, present]) => (
                  <li key={recDate}>
                    <strong>{recDate}:</strong> {present ? 'Present' : 'Absent'}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
         <button className="btn btn-primary mt-3" onClick={handleSave}>Save Attendance</button>
      </div>

     
      </div>
    </>
  );
};

export default AttendanceTracker;
