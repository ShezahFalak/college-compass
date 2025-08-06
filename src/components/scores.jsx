import React, { useState, useEffect } from "react";
import '../App.css';
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/firebaseConfig';
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";



const Scores=()=>{
const[user,setUser]=useState(null);
const [scoresheet,setScoresheet]=useState([]);
const [subject,setSubject]=useState("");
const [score,setScore]=useState("");
const [max,setMax]=useState("");

const navigate =useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userDocRef = doc(db, "scores", u.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
        setScoresheet(docSnap.data().scoresheet || []);
        }
      }
    });

    return () => unsubscribe();
  }, []);
const handleAddscore=()=>{
  const newscore={subject,score:Number(score),max:Number(max)};
  setScoresheet([...scoresheet,newscore])
  setScore("");
  setSubject("");
  setMax("");
}
const getPercent=(score,max)=>{
  const percent=(score/max)*100;
  return percent;
  

}
const getGrade=(score,max)=>{
  const percent=(score/max)*100;
  if(percent>=90) return "A+";
  if(percent>=80 && percent<90) return "A";
  if(percent>=70 && percent<80) return "B";
  if(percent>=60 && percent<70) return "C";
  if(percent>=50 && percent<60) return "D";
  if(percent>=40 && percent<50) return "E";
  if(percent<40) return "F";
}

const handleSignOut=async()=>{
  try{
    await signOut(auth);
    alert("Signed out successfully");
    navigate("/");
  }
  catch(error){
    alert("Error in signing out");
  }
};

const handleSaveScore=async()=>{
  
  try{
    await setDoc(doc(db,"scores",user.uid),{scoresheet});
    alert("Saved");
  }
  catch(err){
    console.error("Error saving assignemnts",err);
    alert("Failed to save. Check console for details");
  }
};


return(
    <>
   

    <nav style={{backgroundColor: "rgb(27, 109, 38)", position:"relative"}} className="navbar navbar-expand-lg  ">
            <span className="navbar-brand text-white"><b>College Compass</b></span>
            <div className="navbar-nav">
              <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
              <NavLink to="/timetable" className="nav-link text-white">Timetable</NavLink>
              <NavLink to="/assignments" className="nav-link text-white">Assignments</NavLink>
              <NavLink to="/scores" className="nav-link text-black">Scores</NavLink>
              <NavLink to="/attendance" className="nav-link text-white">Attendance Tracker</NavLink>
            </div>
            <button className="signout" onClick={handleSignOut}>
              <FiLogOut size={20} className="me-2" />
               Sign Out
            </button>         
          </nav>
    <div style={{ backgroundImage: "linear-gradient(to top,  #66cc66, white)", minHeight:"100vh",                           
  display: "flex",
  flexDirection: "column",
    }}>
    <div style={{color:'rgb(27,109,38)'}} className="text-center mb-4 fs-1 fw-bold">Scores</div>
    <div  className="scores-table">
      <div style={{backgroundColor:"rgba(255, 252, 250, 0.48)"}} className="form-control p-4 g-4">
        <input value={subject} type="text" placeholder="Enter subject name"
        className="bg-white text-black me-4 p-2 input" onChange={(e)=>setSubject(e.target.value)}></input>
        <input value={score} type="number" placeholder="Enter score" 
        className="bg-white text-black p-2 me-4 input" onChange={(e)=>setScore(e.target.value)}></input>
        <input value={max} type="number" placeholder="Enter maximum score" 
        className="bg-white text-black p-2 me-4 input" onChange={(e)=>setMax(e.target.value)}></input>
        <button className="btn btn-primary" onClick={handleAddscore}>Add</button>
        <button className="btn btn-success w-10 ms-3" onClick={handleSaveScore}>Save</button>
      </div>
      <table className="table  table-bordered text-center bg-white">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
            <th>Maximum Marks</th>
            <th>Score out of 100</th>
            <th>Grade</th>
          </tr>
         
        </thead>
        <tbody>
        {scoresheet.map((entry,index) => (
          <tr key={index} >
          <td>{entry.subject}</td>
          <td>{entry.score}</td>
          <td>{entry.max}</td>
          <td>{getPercent(entry.score,entry.max)}</td>
          <td style={{ fontWeight: "bold",color: getGrade(entry.score, entry.max) === "F" ? "red" : "green" }}>{getGrade(entry.score,entry.max)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
</div>
    </>
)
};
export default Scores;