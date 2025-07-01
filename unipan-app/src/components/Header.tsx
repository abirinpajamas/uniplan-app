import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const [search, setSearch] = useState("");
  const features: Record<string, string> = {
    "Cgpa Calculator": "/cgpacalculator",
    "Routine Planner": "/routine",
    "Faculty Review": "/reviewpage",
    "Course Scheduler": "/routine",
    "Meet Faculty": "/meetfaculty",
    "Club Preferences": "/clubs",
  };
  const [showresult, setShowresult] = useState(false);
  const [matched, setMatcheditems] = useState<Record<string, string>>({});

  useEffect(() => {
    const searcheditems: Record<string, string> = {};
    if (search && search !== "") {
      for (const key in features) {
        const item = key.toLowerCase();
        if (item.startsWith(search.toLowerCase())) {
          searcheditems[key] = features[key];
        }
      }
      setMatcheditems(searcheditems);
      setShowresult(Object.keys(searcheditems).length > 0 && search.length > 0);
    } else {
      setMatcheditems({});
      setShowresult(false);
    }
  }, [search]);

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        style={{ fontFamily: '"Special Gothic Expanded One", sans-serif' }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="/website.png"
              alt="UniPlan Logo"
              style={{ height: "60px", marginRight: "1px" }}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/routine"
                >
                  Course Scheduler
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/cgpacalculator">
                  CGPA Calculator
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/reviewpage">
                  Faculty Reviews
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  More
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Faculty Reviews
                    </a>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      About Us
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex position-relative" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              {showresult && (
                <ul className="position-absolute top-100 start-0 end-0 bg-white shadow rounded">
                  {Object.entries(matched).map(([key, value]) => (
                    <li key={key} className="list-unstyled p-2">
                      <a
                        href={value}
                        className="text-decoration-none text-dark"
                        style={{ cursor: "pointer" }}
                      >
                        {key}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        </div>
        {isLoggedIn && (
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};
export default Header;
