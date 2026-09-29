import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
function Navbar({ onOpenChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Get logged-in user
  const getUser = () => {
    const savedUser = localStorage.getItem("citizenAssistUser");
    if (!savedUser) {
      return null;
    }
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };
  const user = getUser();
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("citizenAssistUser");
    setShowProfileMenu(false);
    navigate("/login");
  };
  // First letter for avatar
  const avatarLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🇮🇳</span>
        <span>CitizenAssist</span>
      </Link>
      {/* Navigation */}
      <div className="navbar-links">
        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "nav-link active"
              : "nav-link"
          }
        >
          Home
        </Link>
        <Link
          to="/services"
          className={
            location.pathname === "/services"
              ? "nav-link active"
              : "nav-link"
          }
        >
          Services
        </Link>
        <button
          type="button"
          className="nav-action"
          onClick={onOpenChat}
        >
          AI Assistant
        </button>
      </div>
      {/* Right side */}
      <div className="navbar-right">
        {/* Login button only when user is not logged in */}
        {!user && (
          <button
            type="button"
            className="nav-login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
        {/* Notification */}
        <button
          type="button"
          className="notification-button"
          title="Notifications"
        >
          🔔
          <span className="notification-dot"></span>
        </button>
        {/* Profile */}
        {user && (
          <div className="profile-wrapper">
            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
            >
              <span className="profile-avatar">
                {avatarLetter}
              </span>
              <span className="profile-info">
                <strong>
                  {user.name || "User"}
                </strong>
                <small>
                  {user.email || "Citizen"}
                </small>
              </span>
              <span className="profile-arrow">
                {showProfileMenu ? "⌃" : "⌄"}
              </span>
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <button type="button">
                  ⚙️ Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                >
                  ↪ Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
