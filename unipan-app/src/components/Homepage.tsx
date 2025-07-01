import React, { useState } from "react";

declare global {
  interface Window {
    __TOMORROW__?: {
      renderWidget: () => void;
    };
  }
}
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useEffect } from "react";
import { Toast } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellSlash,
  faBellRinging,
} from "@fortawesome/free-solid-svg-icons";

interface HomePageProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ isLoggedIn }) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [notificationIcon, setNotificationIcon] = useState(faBell);

  const loggedInFeatures = [
    {
      title: "My Schedule",
      description: "View and manage your personalized course schedule.",
      linkText: "View Schedule",
      linkUrl: "/schedule",
      imageUrl: "/images/myf.png",
    },
    {
      title: "CGPA Calculator",
      description:
        "Calculate your new CGPA or predict with your existing completed credits.",
      linkText: "Calculate",
      linkUrl: "/cgpacalculator",
      imageUrl: "/images/calcu.jpg",
    },

    {
      title: "Plan Your Routine",
      description: "Create your ideal course schedule.",
      linkText: "Start Planning",
      linkUrl: "/routine",
      imageUrl: "/images/rout.avif",
    },
    {
      title: "Faculty Reviews",
      description: "Read from our Faculty Reviews or post your Review.",
      linkText: "Post your Review",
      linkUrl: "/reviewpage",
      imageUrl: "/images/faculty.avif",
    },
    {
      title: "Learn About Faculty",
      description:
        "Discover NSU's experienced and knowledgeable faculty members.",
      linkText: "Meet Faculty",
      linkUrl: "/meetfaculty",
      imageUrl: "/images/fac.png",
    },
    {
      title: "Club Preferences",
      description:
        "Explore NSU clubs, view events, recruitment info, and connect with club pages.",
      linkText: "Explore Clubs",
      linkUrl: "/clubs",
      imageUrl: "/images/clubs.jpg",
    },
  ];

  const loggedOutFeatures = [
    {
      title: "CGPA Calculator",
      description: "Calculate and predict your CGPA.",
      linkText: "Calculate",
      linkUrl: "/cgpacalculator",
      imageUrl: "/images/calcu.jpg",
    },

    {
      title: "Plan Your Routine",
      description: "Create your ideal course schedule.",
      linkText: "Start Planning",
      linkUrl: "/routine",
      imageUrl: "/images/rout.avif",
    },
    {
      title: "Faculty Reviews",
      description: "Read from our Faculty Reviews or post your Review.",
      linkText: "Post your Review",
      linkUrl: "/reviewpage",
      imageUrl: "/images/faculty.avif",
    },
    {
      title: "Learn About Faculty",
      description:
        "Discover NSU's experienced and knowledgeable faculty members.",
      linkText: "Meet Faculty",
      linkUrl: "/meetfaculty",
      imageUrl: "/images/fac.png",
    },
    {
      title: "Club Preferences",
      description:
        "Explore NSU clubs, view events, recruitment info, and connect with club pages.",
      linkText: "Explore Clubs",
      linkUrl: "/clubs",
      imageUrl: "/images/clubs.jpg",
    },
  ];

  useEffect(() => {
    // Retrieve user ID from token
    const token = localStorage.getItem("authToken");
    let userIdFromToken = null;
    if (token) {
      try {
        const decodedToken = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        userIdFromToken = decodedToken.data.user; // Adjust based on your token structure
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    setLoggedInUserId(userIdFromToken);
  }, []);

  useEffect(() => {
    if (isLoggedIn && loggedInUserId) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;

      const ws = new WebSocket("ws://localhost:8080"); // Connect to your WebSocket server

      ws.onopen = () => {
        console.log("WebSocket connected for user:", loggedInUserId);
        setSocket(ws);
        ws.send(
          JSON.stringify({ type: "identify_user", userId: loggedInUserId })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_like") {
            setNotifications((prevNotifications) => [
              data.message,
              ...prevNotifications,
            ]);
            setNotificationIcon(faBellSlash); // Change icon when a new notification arrives
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setSocket(null);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } else if (socket) {
      socket.close(); // Close socket if user logs out
      setSocket(null);
      setNotifications([]);
      setNotificationIcon(faBell);
    }
  }, [isLoggedIn, loggedInUserId]);

  useEffect(() => {
    if (
      isLoggedIn &&
      toastRef.current &&
      localStorage.getItem("justloggedin")
    ) {
      const bsToast = new Toast(toastRef.current);
      localStorage.removeItem("justloggedin");
      bsToast.show(); // programmatically show the toast :contentReference[oaicite:2]{index=2}
      const id = "tomorrow-sdk";
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.id = id;
        script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
        script.async = true;
        script.onload = () => window.__TOMORROW__?.renderWidget();
        document.body.appendChild(script);
      } else {
        window.__TOMORROW__?.renderWidget();
      }
    }
  }, [isLoggedIn]);

  const handleNotificationClick = () => {
    // Logic to display the notifications (e.g., open a modal, show a dropdown)
    console.log("Notifications:", notifications);
    setNotificationIcon(faBell); // Reset icon after clicking
    // You would typically display the 'notifications' state here
  };

  return (
    <div style={{ fontFamily: '"Special Gothic Expanded One", sans-serif' }}>
      {isLoggedIn ? (
        <div>
          <div className="toast-container position-fixed top-1 end-0 p-3">
            <div
              ref={toastRef}
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-bs-autohide="true"
              data-bs-delay="3000"
            >
              <div className="toast-header">
                <strong className="me-auto">
                  Welcome home{" "}
                  {localStorage.getItem("username")
                    ? localStorage
                        .getItem("username")!
                        .charAt(0)
                        .toUpperCase() +
                      localStorage.getItem("username")!.slice(1) +
                      "!"
                    : "User!"}
                </strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="tomorrow"
                data-location-id="008486"
                data-language="EN"
                data-unit-system="METRIC"
                data-skin="light"
                data-widget-type="aqiMini"
                style={{ paddingBottom: 5, position: "relative" }}
              ></div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              height: "60px",
            }}
          >
            <h1>NSU UniPlan!</h1>
            <p style={{ marginTop: "auto", fontSize: "15px" }}>
              By the students, For the students
            </p>
            <button
              className="notif"
              style={{
                backgroundColor: "transparent",
                color: "purple",
                border: "none",
                padding: 0,
                bottom: "0",
                marginLeft: "auto",
                filter: "drop-shadow(2px 4px 3px rgba(23, 51, 146, 0.5)),",
                alignSelf: "flex-start",
              }}
              onClick={handleNotificationClick}
            >
              <FontAwesomeIcon
                icon={notificationIcon}
                style={{
                  color: "#007bff",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {loggedInFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  width: "calc(25% - 20px)",
                }}
              >
                {" "}
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px",
            }}
          >
            <button
              className="btn btn-dark"
              style={{ margin: "2px", color: "burlywood" }}
            >
              <Link to="/form">Sign Up</Link>
            </button>
            <button className="btn btn-dark" style={{ margin: "2px" }}>
              <Link to="/login">Log In</Link>
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {loggedOutFeatures.map((feature, index) => (
              <div key={index} style={{ width: "calc(25% - 20px)" }}>
                {" "}
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
