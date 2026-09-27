import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🏛️</span>
          <h1>Welcome to CitizenAssist</h1>
          <p>Login to get personalised government service assistance.</p>
        </div>

        <form className="login-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="login-register">
          Don't have an account?{" "}
         <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;