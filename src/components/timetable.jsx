import React, { useState, useEffect } from "react";
import '../App.css';
import { NavLink } from "react-router-dom";
import { onAuthStateChanged,signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/firebaseConfig';
import {useNavigate} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00'];

const Timetable = () => {
  const [timetable, setTimetable] = useState({});
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('8:00-9:00');
  const [subject, setSubject] = useState('');
  const [user, setUser] = useState(null); 

  const navigate=useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userDocRef = doc(db, "timetables", u.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setTimetable(docSnap.data().timetable || {});
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    const updated = { ...timetable };
    if (!updated[day]) updated[day] = {};
    updated[day][time] = subject;
    setTimetable(updated);
    setSubject('');
  };

  const handleSave = async () => {
    if (!user) return alert("You are not logged in.");
    try {
      await setDoc(doc(db, "timetables", user.uid), { timetable });
      alert("Timetable saved successfully!");
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("Failed to save. Check console for details.");
    }
  };

  const handleSignOut=async()=>{
    try{
      await signOut(auth);
      navigate("/");
    }
    catch(error){
      alert("Could not sign out.");
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary">
        <span className="navbar-brand text-white"><b>College Compass</b></span>
        <div className="navbar-nav">
          <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
          <NavLink to="/timetable" className="nav-link text-black">Timetable</NavLink>
          <NavLink to="/assignments" className="nav-link text-white">Assignments</NavLink>
          <NavLink to="/scores" className="nav-link text-white">Scores</NavLink>
          <NavLink to="/attendance" className="nav-link text-white">Attendance Tracker</NavLink>
        </div>
        <button className="signout" onClick={handleSignOut}>
                                     <FiLogOut size={20} className="me-2" />
                                      Sign Out
                                   </button> 
      </nav>

      <div className="whole-page">
        <div style={{color:'#0d6efd'}} className="text-center mb-4 fs-1 fw-bold">Create your Timetable</div>
        <div className="timetable-wrapper mt-5 px-4">


          <div className="row mb-4">
            <div className="col-md-3">
              <select className="form-control" value={day} onChange={(e) => setDay(e.target.value)}>
                {days.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-control" value={time} onChange={(e) => setTime(e.target.value)}>
                {times.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div  className="col-md-4">
              <input
                className="form-control"
                type="text"
                placeholder="Enter Subject Name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <button className="btn btn-success" onClick={handleSave}>
              Save Timetable
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center bg-white">
              <thead className="thead-dark">
                <tr>
                  <th>Time</th>
                  {days.map((d) => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {times.map((t) => (
                  <tr key={t}>
                    <td><strong>{t}</strong></td>
                    {days.map((d) => (
                      <td key={d}>{timetable[d]?.[t] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timetable;
