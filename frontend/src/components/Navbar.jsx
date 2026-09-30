import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
function Navbar({ onOpenChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("citizenAssistTheme");
  return savedTheme !== "light";
});

useEffect(() => {
  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "dark" : "light"
  );

  localStorage.setItem(
    "citizenAssistTheme",
    isDarkMode ? "dark" : "light"
  );
}, [isDarkMode]);
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
        {/* Theme Toggle */}
<button
  type="button"
  className={`theme-toggle ${isDarkMode ? "theme-toggle--dark" : "theme-toggle--light"}`}
  onClick={() => setIsDarkMode((current) => !current)}
  role="switch"
  aria-checked={isDarkMode}
  aria-label="Dark mode"
  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
>
  <span className="theme-toggle__knob">
    {isDarkMode ? (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    )}
  </span>
</button>
        {/* Login button only when user is not logged in */}
{!user && (
  <button
  type="button"
  className="nav-login-button"
  onClick={() => navigate("/login")}
>
  <span className="login-button-icon">👤</span>
  <span>Login</span>
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
