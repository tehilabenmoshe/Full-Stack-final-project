
import { NavLink, Link } from 'react-router-dom';
import logo from "../assets/logo.png";

export default function Sidebar(){
  return (
    <aside className="side">
      <div className="logo">
        <Link to="/customer">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <nav className="snav">
        <NavLink to="/customer">Home</NavLink>             
        <NavLink to="/customer/profile">Profile</NavLink>   
        <NavLink to="/customer/help">Help</NavLink>
      </nav>
    </aside>
  )
}
