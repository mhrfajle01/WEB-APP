import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import { LogOut, LayoutDashboard } from "lucide-react";
import { SettingsIcon } from "./Icons";


const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 display-font" to="/">
          Modern<span className="text-primary">Blog</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/category/tech">Tech</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/category/lifestyle">Lifestyle</Link>
            </li>
            
            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  <img 
                    src={user.photoURL || "https://via.placeholder.com/32"} 
                    alt={user.displayName} 
                    className="rounded-circle me-2" 
                    width="32" 
                    height="32" 
                  />
                  <span className="d-none d-md-inline">{user.displayName}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <LayoutDashboard size={18} className="me-2" /> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2" to="/settings">
                      <SettingsIcon size={18} className="me-2" /> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <LogOut size={18} className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-3 d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary rounded-pill px-4">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
