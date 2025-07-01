import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Reviewpage from "./reviewpage";
const CommentItem = styled.li`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 47px;
  border-radius: 8px;
  background-color: rgb(205, 214, 221);
  display: flex;
  align-items: flex-start; /* Align items to the top to accommodate multi-line text */
  gap: 10px;
  min-height: 50px; /* Set a minimum height for the icon */
  white-space: pre-wrap; /* Allow text to wrap and respect whitespace */
  overflow-wrap: break-word; /* Break long words to prevent overflow */
  word-break: break-all;

  &::before {
    content: "👤";
    font-size: 1.2em;
    color: rgb(223, 169, 8);
    /* Adjust vertical alignment of the icon if needed */
    /* align-self: flex-start; */
  }
`;
const RatingCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  width: 1050px;
  padding: 20px;
  display: block; /* Or inline-block */
  /* display: flex; - Remove this for margin: 0 auto to work directly */
  /* gap: 30px; */
  align-items: flex-start;
  font-family: "Poppins", sans-serif;
  margin: 0 auto;
  box-shadow: 0 0 15px rgba(108, 91, 123, 0.5);
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OverallRating = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #212529; /* Dark text */
  margin-bottom: 5px;
`;

const OutOfFive = styled.span`
  font-size: 1.2rem;
  color: #6c757d; /* Grey text */
`;

const RatingCount = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 15px;
`;

const ProfessorName = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 5px;
`;

const BookmarkIcon = styled.div`
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 15px;
`;

const ProfessorInfo = styled.p`
  font-size: 0.9rem;
  color: #007bff; /* Blue link color */
  margin-bottom: 20px;
`;

const CourseInfo = styled.p`
  font-size: 0.9rem;
  color: #007bff; /* Blue link color */
  margin-bottom: 20px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #212529;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const RightSection = styled.div`
  flex-grow: 1;
`;

const RatingDistributionTitle = styled.h6`
  font-size: 1rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 10px;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RatingLabel = styled.span`
  font-size: 0.9rem;
  color: #212529;
  width: 80px;
`;

const BarContainer = styled.div`
  background-color: #e9ecef; /* Light grey bar background */
  border-radius: 4px;
  height: 10px;
  flex-grow: 1;
  margin-right: 10px;
  overflow: hidden;
`;

const BarFill = styled.div`
  background-color: #007bff; /* Blue bar fill */
  height: 100%;
  border-radius: 4px;
`;

const RatingCountValue = styled.span`
  font-size: 0.9rem;
  color: #212529;
  width: 20px;
  text-align: right;
`;

const Advertisement = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  text-align: right;
  align-self: flex-start;
`;

interface RatingDistributionProps {
  label: string;
  count: number;
  totalRatings: number;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({
  label,
  count,
  totalRatings,
}) => {
  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  return (
    <RatingBar>
      <RatingLabel>{label}</RatingLabel>
      <BarContainer>
        <BarFill style={{ width: `${percentage}%` }} />
      </BarContainer>
      <RatingCountValue>{count}</RatingCountValue>
    </RatingBar>
  );
};

interface ProfessorCardProps {
  isLoggedIn: boolean;
  initial: number;
  professorName: string;
  overallRating: number;
  ratingCount: number;
  department: string;
  wouldTakeAgainPercentage: string | number;
  levelOfDifficulty: number;
  ratingDistribution: { [key: string]: number };
  email: string;
  courses: { courseName: string; courseCode: string }[];
}

const Facultyreview: React.FC<ProfessorCardProps> = ({
  // Or your specific interface
  isLoggedIn,
  initial,
  professorName,
  overallRating,
  ratingCount,
  department,
  wouldTakeAgainPercentage,
  levelOfDifficulty,
  ratingDistribution,
  email,
  courses,
}) => {
  const [reviewText, setReviewText] = useState("");
  const [comments, setComments] = useState<
    {
      Review_Text: string;
      id: number;
      idno: number;
      likes: number;
      liker_ids: string;
    }[]
  >([]);
  const [userratings, setUserratings] = useState<
    { rating: number; difficulty: number; takeagain: boolean }[]
  >([]);
  const [commentText, setCommentText] = useState("");
  const [postreview, setPostreview] = useState(false);
  const [postcomment, setPostcomment] = useState(false);
  const [takeagain, setTakeagain] = useState<boolean | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<number>();
  const [rating, setRating] = useState<number>();
  const [avgrating, setAvgrating] = useState<number>();
  const [takeagainPerc, setTakeagainPerc] = useState<number>(0);
  const [avgdiff, setAvgdiff] = useState<number>(0);
  const [ratingDist, setRatingDist] = useState<{ [key: string]: number }>({});
  const [checkdel, setCheckdel] = useState(false);
  const [id, SetId] = useState<number>();
  const [comnum, setComnum] = useState<number | null>(null);
  const totalRatings = Object.values(ratingDist).reduce(
    (sum, count) => sum + count,
    0
  );
  const [charcount, setCharcount] = useState<number>(0);

  console.log("Faculty userratings:", userratings);

  const handlePostReview = async () => {
    //setPostcomment(true);
    const token = localStorage.getItem("authToken");
    if (commentText && commentText.trim()) {
      console.log(`Review posted for ${professorName}: ${commentText}`);
      console.log("initial:", initial);
      try {
        const response = await axios.post(
          " http://localhost/website/php/reviewpost.php",
          {
            commentText,
            initial,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        if (response.data.success) {
          alert(response.data.message);
          fetchReviews();
          //navigate("/login");
        } else {
          alert(response.data.message);
          //setError(response.data.error || "Signup failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please select a professor and enter your review.");
    }
  };

  //console.log(`Review posted for ${professorName}: ${commentText}`);
  //console.log("initial:", initial);
  const fetchReviews = async () => {
    try {
      const resp = await axios.post(
        " http://localhost/website/php/reviewfetch.php",
        {
          initial,
        }
      );
      if (Array.isArray(resp.data)) {
        setComments(resp.data);
        console.log("Faculty data:", resp.data);
      } else {
        console.error("Error: Faculty data is not an array:", resp.data);
      }
    } catch (error) {
      console.log("An error occurred while fetching reviews.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [initial]);

  const fetchRatings = async () => {
    try {
      const respo = await axios.post(
        " http://localhost/website/php/ratingfetch.php",
        {
          initial,
        }
      );
      if (Array.isArray(respo.data)) {
        setUserratings(respo.data);
        console.log("Faculty userratings:", userratings);
      } else {
        console.error("Error: Faculty ratings is not an array:", respo.data);
      }
    } catch (error) {
      console.log("An error occurred while fetching ratings.");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [initial]);

  const handleHoveringReviewSubmit = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);
    if (typeof takeagain === "boolean" && difficulty && rating && rating <= 5) {
      console.log(`Rating posted for ${professorName}: ${rating}`);
      console.log("difficulty:", difficulty);
      console.log("takeagain:", takeagain);
      try {
        const response = await axios.post(
          " http://localhost/website/php/ratingpost.php",
          {
            initial,
            takeagain,
            difficulty,
            rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        if (response.data.success) {
          alert(response.data.message);
          fetchRatings();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill all the fields.");
    }
  };

  const handleHoveringReviewCancel = () => {
    setPostreview(false);
  };

  useEffect(() => {
    if (userratings.length > 0) {
      const sum = userratings.reduce((acc, curr) => acc + curr.rating, 0);
      setAvgrating(sum / userratings.length);
    } else {
      setAvgrating(0);
    }
  }, [userratings]);
  useEffect(() => {
    if (userratings.length > 0) {
      const sum = userratings.reduce((acc, curr) => acc + curr.difficulty, 0);
      setAvgdiff(sum / userratings.length);
    } else {
      setAvgdiff(0);
    }
  }, [userratings]);

  useEffect(() => {
    if (userratings.length > 0) {
      const yesCount = userratings.reduce((acc, curr) => {
        return curr.takeagain ? acc + 1 : acc;
      }, 0);
      const percentage = (yesCount / userratings.length) * 100;
      setTakeagainPerc(percentage);
    } else {
      setTakeagainPerc(0);
    }
  }, [userratings]);

  useEffect(() => {
    if (userratings.length > 0) {
      const distribution = userratings.reduce<Record<string, number>>(
        (acc, curr) => {
          const ratingValue = curr.rating;

          let ratingLabel = "";
          if (ratingValue === 5) {
            ratingLabel = "Awesome 5";
          } else if (ratingValue === 4) {
            ratingLabel = "Great 4";
          } else if (ratingValue === 3) {
            ratingLabel = "Good 3";
          } else if (ratingValue === 2) {
            ratingLabel = "OK 2";
          } else if (ratingValue === 1) {
            ratingLabel = "Awful 1";
          }

          if (ratingLabel) {
            acc[ratingLabel] = (acc[ratingLabel] || 0) + 1;
          }

          return acc;
        },
        {}
      );

      setRatingDist(distribution);
    } else {
      setRatingDist({});
    }
  }, [userratings]);
  const deletecom = async (comment: number) => {
    setComnum(null);
    console.log("Deleting comment:", comment); // Use the value to avoid unused variable error
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);

    try {
      const response = await axios.post(
        " http://localhost/website/php/deletecomment.php",
        {
          initial,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.data.success) {
        fetchReviews();
        //alert(response.data.message);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      console.log("Token:", token);
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        //console.log("Token Payload:", payload);
        SetId(payload.data.user);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found in local storage.");
    }
  });

  useEffect(() => {
    if (commentText.length <= 50) {
      setCharcount(50 - commentText.length);
    }
  }, [commentText]);

  const updatelike = async (comment: number) => {
    if (id) {
      console.log("Liking comment:", comment);
      const token = localStorage.getItem("authToken");
      console.log("Token:", token);

      try {
        const response = await axios.post(
          " http://localhost/website/php/like.php",
          {
            comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        if (response.data.success) {
          fetchReviews();
          //alert(response.data.message);
        } else {
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <RatingCard
      style={{
        fontFamily: '"Special Gothic Expanded One", sans-serif',
        fontWeight: 150,
      }}
    >
      <LeftSection>
        <OverallRating>
          {avgrating == 0 ? 0 : avgrating?.toFixed(1)}
        </OverallRating>
        <OutOfFive>/5</OutOfFive>
        <RatingCount>
          Overall Quality Based on {userratings.length} ratings
        </RatingCount>
        <ProfessorName>{professorName}</ProfessorName>
        <h6>{email}</h6>
        <BookmarkIcon>🏷️</BookmarkIcon>
        <ProfessorInfo>
          Professor in the{" "}
          <span style={{ color: "#007bff", textDecoration: "underline" }}>
            {department}
          </span>{" "}
          department
          <span style={{ color: "#007bff" }}></span>
        </ProfessorInfo>
        <CourseInfo>
          Takes{" "}
          <span style={{ color: "#007bff" }}>
            {courses.map((course, index) => {
              const isLast = index === courses.length - 1;
              const is2ndLast = index === courses.length - 2;
              return (
                <span key={index}>
                  {course.courseCode}
                  {!isLast && !is2ndLast && ", "}
                  {is2ndLast && " and "}
                </span>
              );
            })}
          </span>
        </CourseInfo>
        <StatsRow>
          <StatItem>
            <StatValue>{takeagainPerc}%</StatValue>
            <StatLabel>Would take again</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{avgdiff?.toFixed(1)}</StatValue>
            <StatLabel>Level of Difficulty</StatLabel>
          </StatItem>
        </StatsRow>
      </LeftSection>
      <RightSection>
        <RatingDistributionTitle>Rating Distribution</RatingDistributionTitle>
        <RatingDistribution
          label="Awesome 5"
          count={ratingDist["Awesome 5"] || 0}
          totalRatings={totalRatings}
        />
        <RatingDistribution
          label="Great 4"
          count={ratingDist["Great 4"] || 0}
          totalRatings={totalRatings}
        />
        <RatingDistribution
          label="Good 3"
          count={ratingDist["Good 3"] || 0}
          totalRatings={totalRatings}
        />
        <RatingDistribution
          label="OK 2"
          count={ratingDist["OK 2"] || 0}
          totalRatings={totalRatings}
        />
        <RatingDistribution
          label="Awful 1"
          count={ratingDist["Awful 1"] || 0}
          totalRatings={totalRatings}
        />
      </RightSection>
      <ReviewSection>
        <button className="container" onClick={() => setPostreview(true)}>
          Rate
        </button>
      </ReviewSection>
      {postreview &&
        (!isLoggedIn ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label>
              <Link to="/login">Log In</Link> to rate
            </label>
          </div>
        ) : (
          <HoveringReviewInputContainer>
            <h3 style={{ marginBottom: "30px" }}>Rate {professorName}</h3>
            <button
              className="container"
              style={{ position: "absolute", bottom: "180px", right: "12px" }}
              onClick={handleHoveringReviewCancel}
            >
              X
            </button>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="">
                Would you again take a course under this professor? &nbsp;
              </label>
              <input
                className="form-check-input"
                type="radio"
                name="input1"
                id="inlineCheckbox1"
                value="yes"
                onChange={() => setTakeagain(true)}
              />
              <label> &nbsp; Yes &nbsp; </label>
              <input
                className="form-check-input"
                type="radio"
                name="input1"
                id="inlineCheckbox1"
                value="No"
                onChange={() => setTakeagain(false)}
              />
              <label> &nbsp; No</label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label>Rate level of difficulty out of 10 &nbsp;</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  style={{ width: "70px" }}
                >
                  <option value="" disabled selected></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <label>Overall rating out of 5 &nbsp;</label>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ width: "70px" }}
              >
                <option value="" disabled selected></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <button
              style={{ position: "absolute", bottom: "30px", right: "40px" }}
              className="container"
              onClick={handleHoveringReviewSubmit}
            >
              Submit
            </button>
          </HoveringReviewInputContainer>
        ))}

      <CommentSection>
        <h4>Leave a Review</h4>
        <div style={{ position: "relative" }}>
          <textarea
            value={commentText}
            minLength={100}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`It doesn't hurt to be honest!`}
            rows={2}
            style={{
              width: "100%",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          />
          {commentText.length <= 50 && (
            <label
              style={{
                position: "absolute",
                bottom: "33px",
                right: "10px",
                fontSize: "0.8em",
                pointerEvents: "none",
              }}
            >
              {charcount} left
            </label>
          )}
        </div>

        <button
          className="container"
          onClick={isLoggedIn ? handlePostReview : () => setPostcomment(true)}
          disabled={commentText.length < 50}
        >
          Post
        </button>
        {postcomment ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label>
              <Link to="/login">Log In</Link> to post a review
            </label>
          </div>
        ) : null}

        <h3>Reviews</h3>
        {comments.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {comments.map((comment, index) => {
              const ids = comment.liker_ids ? comment.liker_ids.split(",") : [];
              const hasliked = ids.includes(id ? id.toString() : "");
              return (
                <CommentItem key={index} style={{ position: "relative" }}>
                  <div
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "blue",
                        marginBottom: "0.5em",
                      }}
                    >
                      {comment.name}
                    </span>

                    {comment.Review_Text}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "-40px",
                      right: "20px",
                      display: "flex",
                      gap: "0.5em",
                    }}
                  >
                    <button
                      className={
                        hasliked
                          ? "btn btn-sm btn-primary"
                          : "btn btn-sm btn-outline-primary"
                      }
                      onClick={() => updatelike(comment.id)}
                    >
                      {hasliked ? "Agreed" : "Agree"}
                    </button>
                    <label>{comment.likes > 0 ? comment.likes : null}</label>
                  </div>

                  {id == Number(comment.idno) && (
                    <button
                      style={{ marginLeft: "auto" }}
                      className="btn btn-danger btn-sm"
                      onClick={() => setComnum(comment.id)}
                    >
                      X
                    </button>
                  )}

                  {comnum && (
                    <div
                      id="confirmation-overlay"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        id="confirmation-box"
                        style={{
                          backgroundColor: "white",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          textAlign: "center",
                          width: "290px",
                        }}
                      >
                        <p
                          style={{
                            marginBottom: "20px",
                            fontSize: "1em",
                            color: "#333",
                          }}
                        >
                          Are you sure you want to <br /> delete this comment?
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <button
                            id="confirm-yes"
                            className="container"
                            style={{
                              color: "#e9350f",
                            }}
                            onClick={() => deletecom(comnum)}
                          >
                            Yes
                          </button>
                          <button
                            id="confirm-no"
                            className="container"
                            onClick={() => setComnum(null)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </CommentItem>
              );
            })}
          </ul>
        ) : (
          <p>No Reviews yet.</p>
        )}
      </CommentSection>
    </RatingCard>
  );
};

const HoveringReviewInputContainer = styled.div`
  position: fixed;
  width: 800px;
  height: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReviewSection = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 150px; /* Example: Set a width less than 100% */
  margin: 10px auto 0;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%; /* Take full width within the RatingCard */
`;
export default Facultyreview;
