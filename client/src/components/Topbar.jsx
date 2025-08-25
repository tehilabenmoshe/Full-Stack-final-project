import { useAuth } from '../AuthProvider'; 
import { useNavigate } from "react-router-dom";

export default function Topbar({ query, onChange }) {
  const { user, logout } = useAuth();
  const displayName = user?.username ?? user?.name ?? 'Guest';
  const nav = useNavigate();


  const handleLogout = () => {
    logout();                 // ניקוי user+token
    nav("/Login", { replace: true }); // חזרה למסך התחברות
  };


  return (
    <header className="top">
      <div className="searchbar">
        {/* אייקון זכוכית מגדלת */}
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm8.53 12.47a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 0 1-1.41 0l-3.1-3.1a1 1 0 1 1 1.41-1.41l3.16 3.04z"/>
        </svg>

        <input
          type="search"
          className="search-input"
          placeholder="Search someting to eat"
          value={query}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="top-right">
        <div className="userbox">Welcome, {displayName}!</div>

        <button className="logout-btn" onClick={handleLogout} aria-label="Log out">
          
          <span>Logout</span>
        </button>
      </div>

    </header>
  );
}
