import React, { useState, useEffect } from "react";
import '../App.css';
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/firebaseConfig';
import {useNavigate} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";


    const Assignment=()=>{
    const[user,setUser]=useState(null);
    const[assignment,setAssignment]=useState({});
    const[title,setTitle]=useState('');
    const[duedate,setDueDate]=useState('');
    const[assignmentList,setAssignmentList]=useState([]);

    const navigate=useNavigate();

    const handleSignOut= async ()=>{
      try{
        await signOut(auth);
        alert("Signed out successfully");
        navigate("/");

      }catch(error){
        alert("Failed to signout");
      }
    };

    const handleAdd=()=>{
      if(title.trim()=='' || duedate.trim()==''){
    alert("Enter pending assignment with due date.");
    return;
  }
      if(title.trim()!==''&& duedate.trim()!==''){
      const newAssignment={title,duedate,completed:false};
      setAssignmentList([...assignmentList,newAssignment]);
      setTitle('');
      setDueDate('');
      }
    };
    const handleComplete=(index)=>{
      const updatedList=[...assignmentList];
      updatedList[index].completed=true;
      setAssignmentList(updatedList);
    };
    const handleRemove=(index)=>{
      const newList=[...assignmentList];
      newList.splice(index,1);
      setAssignmentList(newList);
    };
     
const handleSaveass=async()=>{
  
  try{
    await setDoc(doc(db,"assignments",user.uid),{assignmentList});
    alert("Saved");
  }
  catch(err){
    console.error("Error saving assignemnts",err);
    alert("Failed to save. Check console for details");
  }
};
 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userDocRef = doc(db, "assignments", u.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setAssignmentList(docSnap.data().assignmentList || []);
        }
      }
    });

    return () => unsubscribe();
  }, []);
    return (
        <>
        <nav style={{position:"relative"}} className="navbar navbar-expand-lg navbar-assignment  ">
                <span className="navbar-brand text-white"><b>College Compass</b></span>
                <div className="navbar-nav">
                  <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
                  <NavLink to="/timetable" className="nav-link text-white">Timetable</NavLink>
                  <NavLink to="/assignments" className="nav-link text-black">Assignments</NavLink>
                  <NavLink to="/scores" className="nav-link text-white">Scores</NavLink>
                  <NavLink to="/attendance" className="nav-link text-white">Attendance Tracker</NavLink>
                </div>
               <button className="signout" onClick={handleSignOut}>
                             <FiLogOut size={20} className="me-2" />
                              Sign Out
                           </button> 

              </nav>
              

              <div className="wholepage-ass">
    <div className="text-center mb-4 fs-1 fw-bold heading2">Assignments</div>
    <div style={{backgroundColor:"rgba(255, 252, 250, 0.48)"}}  className="form-control p-3">
    <input type="text" className=" bg-white text-black col-md-4 me-5  input" placeholder="Enter Assigments left to complete"
    value={title} onChange={(e)=>setTitle(e.target.value)}></input>
    <input type="date" className="duedate bg-white text-black col-md-2" placeholder="Enter due data"
    value={duedate} onChange={(e)=>setDueDate(e.target.value)}></input>
    <button className="btn btn-primary w-10 ms-3" onClick={handleAdd}>Add</button>
    </div>

    <div className="result">
      <ol>
        {assignmentList.map((item,index)=>(
          <li key={index} >
  <div className="assignment-row">
    <div className="col title-col" style={{textDecoration: item.completed ? 'line-through' : 'none'}}>{item.title}</div>
    <div className="col due-col" style={{textDecoration: item.completed ? 'line-through' : 'none'}}>Due: {item.duedate}</div>
    <div className="col btn-col">
      <button className="btn btn-success me-2 mt-3" onClick={() => handleComplete(index)}>Completed</button>
      <button className="btn btn-danger mt-3" onClick={() => handleRemove(index)}>Remove</button>
    </div>
  </div>
</li>
          
        ))}
      </ol>
      <button className="btn btn-success w-10 ms-3" onClick={handleSaveass}>Save</button>

    </div>
    
   
     </div>
   
    </>

);
};

export default Assignment;

