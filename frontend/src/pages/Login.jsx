import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.detail || "Login failed.");
        return;
      }
      // Save logged-in user
      localStorage.setItem(
        "citizenAssistUser",
        JSON.stringify({
          name: data.name || email.split("@")[0],
          email,
        })
      );
      setMessage(data.message || "Login successful.");
      localStorage.setItem(
  "citizenAssistUser",
  JSON.stringify({
    name: data.name,
    email: data.email,
  })
);
      localStorage.setItem(
  "citizenAssistUser",
  JSON.stringify({
    name: data.name,
    email: data.email,
  })
);
      // Go to home page after login
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        "Backend se connection nahi ho pa raha hai."
      );
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🏛️</span>
          <h1>Welcome to CitizenAssist</h1>
          <p>
            Login to get personalised government service assistance.
          </p>
        </div>
        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
          <button type="submit">
            Login
          </button>
          {message && (
            <p className="login-message">
              {message}
            </p>
          )}
        </form>
        <p className="login-register">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
