import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import burger from "../assets/burger.png";
import logo from "../assets/logo.png";
import { useAuth } from '../AuthProvider'; // ודאי שהנתיב נכון

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({})); // הגנה אם אין גוף
      if (!res.ok) {
        throw new Error(data?.error || 'Login failed');
      }

      // עדכון גלובלי דרך ה-Context (login שומר token+user מקומית)
      login({ user: data.user, token: data.token });

      // איפוס וניווט
      setUsername('');
      setPassword('');
      nav('/customer', { replace: true });
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
