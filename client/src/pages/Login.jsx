import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import burger from "../assets/burger.png";
import logo from "../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        let msg = 'Login failed';
        try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
      }

      const data = await res.json(); // { user, token }
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user)  localStorage.setItem('user', JSON.stringify(data.user));

      setUsername('');
      setPassword('');
      nav('/customer', { replace: true }); // ניווט לעמוד הלקוח
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="logo2"><img src={logo} alt="Logo" /></div>
        <div className="picture"><img src={burger} alt="burger" /></div>
      </div>

      <div className="register-right">
        <h2>User Login</h2>
        <form onSubmit={handleLogin} className="register-form">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
