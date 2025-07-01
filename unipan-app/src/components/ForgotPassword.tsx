import React, { useState } from "react";
import axios from "axios";
import "../index.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/website/php/forgot-password.php",
        {
          email,
        }
      );
      console.log("Response Data:", response.data);
      if (response.data.success) {
        setMessage("A reset link has been sent to your email.");
      } else {
        setMessage("Email not found in the system.");
      }
      console.log(response.data.error);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="forgot-password-container"
      id="forgot"
      style={{ width: "500px" }}
    >
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ display: "flex", gap: "2px" }}
          />

          <button type="submit" className="container" style={{ padding: "2" }}>
            Send Reset Link
          </button>
        </div>
      </form>

      {message && <div>{message}</div>}
    </div>
  );
};

export default ForgotPassword;
