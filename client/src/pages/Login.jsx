import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import '../styles/Register.css'; 
import burger from "../assets/burger.png";
import logo from "../assets/logo.png";

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    const res = await fetch(`http://localhost:3000/users?username=${username}&website=${password}`);
    const users = await res.json();
    console.log('Fetched users:', users);

    if (users.length > 0) {
      setUser(users[0]); 
      setUsername(null);
      setPassword(null);
      setIsLoggedIn(true);
    } else {
      setError('Password or username is incorrect');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="register-page">
      <div className="register-left">
         <div className="logo2">              
            <img src={logo} alt="Logo" />               
        </div> 
        
         <div className="picture">
            <img src={burger} alt="burger" />    
          </div>
        <h1> Welcome Back</h1>
      
      </div>
      <div className="register-right">
        
        <h2>User Login</h2>
        <form onSubmit={handleLogin} className="register-form">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p className="login-link">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
