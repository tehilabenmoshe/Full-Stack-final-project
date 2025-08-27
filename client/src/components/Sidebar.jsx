
import { NavLink, Link } from 'react-router-dom';
import logo from "../assets/logo.png";

export default function Sidebar(){
  return (
    <aside className="side">
      <div className="logo">
        {/* הלוגו יחזיר גם הוא ל- /customer */}
        <Link to="/customer">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <nav className="snav">
        <NavLink to="/customer">Home</NavLink>              {/* ✅ חוזר לעמוד הראשי */}
        <NavLink to="/customer/profile">Profile</NavLink>   {/* ✅ נשאר לפרופיל */}
        <NavLink to="/customer/cart">My Cart 🛒</NavLink>
        <NavLink to="/customer/help">Help</NavLink>
      </nav>
    </aside>
  )
}
