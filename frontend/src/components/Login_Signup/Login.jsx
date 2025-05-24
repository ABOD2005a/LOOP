/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Login_Signup.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8081/login", {
        params: { Email: username, Password: password },
      })
      .then((response) => {
        alert(response.data);
        navigate("/Home");
      })
      .catch((error) => {
        alert("Login failed");
        console.error(error);
      });
  };

  return (
    <motion.div
      className="wrapper"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1 style={{ textAlign: "center", fontSize: "36px" }}>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forget">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <a href="#">Forget Password?</a>
          </div>

          <button type="submit" disabled={!rememberMe}>
            Login
          </button>

          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;
