import Header from "./components/Header";
import HomePage from "./components/Homepage";
import Form from "./components/Form";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Courseroutineform from "./components/Courseroutineform";
import { styled } from "styled-components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cgpacalc from "./components/Cgpacalc";
import ForgotPassword from "./components/ForgotPassword";

import Reviewpage from "./components/reviewpage";
import Myschedule from "./components/Myschedule";
import Meetfaculty from "./components/Meetfaculty";
import ClubPreferences from "./components/ClubPreferences";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
`;

const FooterContainer = styled.footer`
  background-color: #222;
  color: #eee;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    padding: 20px 20px;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContainer>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
          }}
        />
        <MainContent>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  isLoggedIn={isLoggedIn}
                  onLogout={() => {
                    localStorage.removeItem("authToken");
                    setIsLoggedIn(false);
                  }}
                />
              }
            />
            <Route
              path="/form"
              element={
                <Form
                  onSignupSuccess={() => {
                    console.log("Signup successful!");
                  }}
                />
              }
            />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace /> // Redirect to homepage if already logged in
                ) : (
                  <Login
                    onLoginSuccess={(token) => {
                      localStorage.setItem("authToken", token);
                      setIsLoggedIn(true);
                    }}
                  />
                )
              }
            />
            <Route
              path="/routine"
              element={<Courseroutineform isLoggedIn={isLoggedIn} />}
            />
            <Route path="/cgpacalculator" element={<Cgpacalc />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route
              path="/schedule"
              element={
                <Myschedule
                  savedRoutines={[]}
                  onViewRoutine={(routine) =>
                    console.log("View routine:", routine)
                  }
                  onDeleteRoutine={(routineId) =>
                    console.log("Delete routine:", routineId)
                  }
                  isLoggedIn={isLoggedIn}
                />
              }
            />

            <Route
              path="/reviewpage"
              element={<Reviewpage isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/meetfaculty"
              element={<Meetfaculty isLoggedIn={isLoggedIn} />}
            />

            <Route path="/clubs" element={<ClubPreferences />} />

            {/*<Route
              path="/review"
              element={
                <Facultyreview
                  label="Course Feedback"
                  count={10}
                  totalRatings={100}
                />
              }
            /> */}
          </Routes>
        </MainContent>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
