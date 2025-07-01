import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [LoginData, setLoginData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginid, setLoginid] = useState("");
  const [pass, setPass] = useState("");
  const [showpass, setShowpass] = useState(false);

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginid || !pass) {
      alert("Please fill in all fields.");
      return;
    }
    if (!loginid.includes("@")) {
      alert("Invalid Email or Username.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/website/php/login.php",

        {
          loginid,
          pass,
        }
      );

      console.log(response.data);

      if (response.data.success) {
        onLoginSuccess(response.data.token);
        localStorage.setItem("username", response.data.name);
        const justloggedin = "yes";
        localStorage.setItem("justloggedin", justloggedin);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const togglePasswordVisibility = () => {
    setShowpass(!showpass);
  };
  return (
    <form className="Login" onSubmit={handlesubmit}>
      <div className="input-group mb-3">
        <span className="input-group-text" id="auth">
          Enter Username or Email
        </span>
        <input
          type="text"
          className="form-control"
          value={loginid}
          onChange={(e) => setLoginid(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="pass">
          Password
        </span>
        <input
          type={showpass ? "text" : "password"}
          className="form-control"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button
          className="btn btn-light"
          type="button"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon icon={showpass ? faEyeSlash : faEye} />
        </button>
      </div>
      <p>
        Don't have an account?<Link to="/form">Sign up</Link>
      </p>
      <p>
        Forgot Password?<Link to="/forgot">Click here</Link>
      </p>
      <div className="input-group mb-3">
        <button className="container" id="loginb">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
