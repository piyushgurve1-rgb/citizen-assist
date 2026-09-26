import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ onOpenChat }) {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
        <div className="profile-wrapper">
          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setShowProfileMenu(!showProfileMenu)
            }
          >
            <span className="profile-avatar">
              A
            </span>

            <span className="profile-info">
              <strong>Ajay</strong>
              <small>Citizen</small>
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

              <button type="button">
                ↪ Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;