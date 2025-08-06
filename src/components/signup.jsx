import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted with:", email, password);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      alert("Account created successfully!");
      navigate("/dashboard"); // or "/login" if you prefer
    } catch (err) {
      console.error("Signup error code:", err.code);
      console.error("Signup error message:", err.message);
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-card" style={{ width: "350px", padding: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
            />
          </div>
          {error && (
            <div className="alert alert-danger text-center" role="alert" style={{ color: "red", marginBottom: "12px" }}>
              {error}
            </div>
          )}
          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
            Sign Up
          </button>
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
