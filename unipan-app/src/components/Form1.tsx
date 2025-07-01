import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { useState } from "react";
import React from "react";
import axios from "axios";
function Form() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fname || !lname || !email || !username || !pass) {
      alert("Please fill in all fields.");
      return;
    }
    if (!email.includes("@") || !email.includes(".com")) {
      alert("Invalid Email.");
      return;
    }
    if (!(username.length > 7)) {
      alert("Username must be at least 8 characters.");
      return;
    }
    if (!(pass.length > 7)) {
      alert("Password must be at least 8 characters.");
      return;
    }
    if (!/\d/.test(pass)) {
      alert("Include numbers in your password.");
      return;
    } else if (!/[@!%$]/.test(pass)) {
      alert("Include Special characters @!%$ in your password.");
      return;
    }

    const response = await axios.post(
      "http://localhost/website/php/index.php",
      { fname }
    );
    console.log(response);
    const result = response.data;
    if (result.status == "success") {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <form className="Register" onSubmit={handlesubmit}>
      <div className="input-group mb-3">
        <span className="input-group-text" id="fname">
          First Name
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="John"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="lname">
          Last Name
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Smith"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="email">
          Email
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="username">
          Username
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="John@5046"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="pass">
          Password
        </span>
        <input
          type="text"
          className="form-control"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <button id="registerb">Register</button>
      </div>
    </form>
  );
}

export default Form;
