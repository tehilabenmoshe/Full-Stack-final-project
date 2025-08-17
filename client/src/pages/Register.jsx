import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import '../styles/Register.css';
import logo from "../assets/logo.png";

function Register() {
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [verify, setVerify] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (website !== verify) {
      setError('The passwords do not match');
      return;
    }

    const res = await fetch(`http://localhost:3000/users?username=${username}`);
    const users = await res.json();

    if (users.length > 0) {
      setError('Username already exists');
      return;
    }

    localStorage.setItem('tempUser', JSON.stringify({ username, website }));
    setIsRegistered(true);
  };

  if (isRegistered) {
    return <Navigate to="/complete-registration" replace />;
  }

  return (
    <div className="register-page">
      <div className="register-left">
        <h1>Welcome to Our App</h1>
        <p>Manage your tasks, posts, and albums with ease.</p>
      </div>
      <div className="register-right">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Verify Password"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Register;
