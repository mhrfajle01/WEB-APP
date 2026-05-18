import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import { 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  Search, 
  Home, 
  Cpu, 
  Sparkles,
  Settings,
  LogIn,
  UserPlus
} from "lucide-react";

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsSidebarOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsSidebarOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSidebarOpen) setIsSidebarOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    { to: "/category/tech", label: "Tech", icon: <Cpu size={20} /> },
    { to: "/category/lifestyle", label: "Lifestyle", icon: <Sparkles size={20} /> },
  ];

  return (
    <>
      {/* Mobile/Tablet Header */}
      <header className="d-lg-none fixed-top bg-white border-bottom px-4 d-flex align-items-center justify-content-between" style={{ height: 'var(--header-height)', zIndex: 1030 }}>
        <Link className="text-decoration-none fw-bold fs-4 text-dark display-font" to="/">
          Modern<span className="text-primary">Blog</span>
        </Link>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-link text-dark p-2" onClick={toggleSearch} aria-label="Search">
            <Search size={22} />
          </button>
          <button className="btn btn-link text-dark p-2" onClick={toggleSidebar} aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Desktop Minimalism Menu (Top Right) */}
      <nav className="desktop-nav d-none d-lg-flex">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-decoration-none fw-semibold transition ${isActive ? 'text-primary' : 'text-secondary hover-primary'}`}>
            {link.label}
          </NavLink>
        ))}
        <div className="vr mx-1" style={{ height: '1.5rem', opacity: 0.1 }}></div>
        <button className="btn btn-link text-secondary p-0 hover-primary transition" onClick={toggleSearch}>
          <Search size={20} />
        </button>
        
        {user ? (
          <div className="dropdown">
            <button className="btn btn-link p-0 d-flex align-items-center text-decoration-none" data-bs-toggle="dropdown">
              <img 
                src={user.photoURL || "https://via.placeholder.com/32"} 
                alt={user.displayName} 
                className="rounded-circle border" 
                width="32" height="32" 
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 py-2 rounded-4 overflow-hidden">
              <li className="px-4 py-3 bg-light mb-2">
                <div className="fw-bold text-dark small">{user.displayName}</div>
                <div className="text-muted extra-small" style={{ fontSize: '0.65rem' }}>{user.email}</div>
              </li>
              <li>
                <Link className="dropdown-item d-flex align-items-center gap-3 py-2 px-4" to="/admin">
                  <LayoutDashboard size={16} /> Admin Panel
                </Link>
              </li>
              <li>
                <Link className="dropdown-item d-flex align-items-center gap-3 py-2 px-4" to="/settings">
                  <Settings size={16} /> Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider opacity-50" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-3 py-2 px-4 text-danger" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="text-decoration-none fw-semibold text-secondary hover-primary transition">Login</Link>
            <Link to="/signup" className="btn btn-primary rounded-pill px-4 btn-sm fw-bold shadow-sm">Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Professional Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

      {/* Professional Sidebar (Mobile/Tablet) */}
      <aside className={`sidebar-nav ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Link className="text-decoration-none fw-bold fs-5 text-dark display-font" to="/">
            Modern<span className="text-primary">Blog</span>
          </Link>
          <button className="btn btn-link text-secondary p-0" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="mb-5">
            <p className="extra-small text-muted mb-3 px-3">Main Navigation</p>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item-sidebar ${isActive ? 'active' : ''}`}>
                {link.icon} {link.label}
              </NavLink>
            ))}
          </div>

          <div>
            <p className="extra-small text-muted mb-3 px-3">Personal Account</p>
            {user ? (
              <>
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-4 mx-2">
                  <img 
                    src={user.photoURL || "https://via.placeholder.com/48"} 
                    alt={user.displayName} 
                    className="rounded-circle shadow-sm" 
                    width="48" height="48" 
                  />
                  <div className="overflow-hidden">
                    <div className="fw-bold text-dark text-truncate small">{user.displayName}</div>
                    <div className="text-muted extra-small text-truncate" style={{ fontSize: '0.6rem' }}>{user.email}</div>
                  </div>
                </div>
                {isAdmin && (
                  <NavLink to="/admin" className="nav-item-sidebar">
                    <LayoutDashboard size={20} /> Admin Panel
                  </NavLink>
                )}
                <NavLink to="/settings" className="nav-item-sidebar">
                  <Settings size={20} /> Settings
                </NavLink>
                <button onClick={handleLogout} className="nav-item-sidebar border-0 bg-transparent w-100 text-danger text-start">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="d-flex flex-column gap-2 px-2">
                <Link to="/login" className="nav-item-sidebar bg-light">
                  <LogIn size={20} /> Login
                </Link>
                <Link to="/signup" className="btn btn-primary rounded-3 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
                  <UserPlus size={20} /> Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Professional Search Overlay (Slide-down) */}
      <div className={`search-overlay-full ${isSearchOpen ? 'active' : ''}`}>
        <div className="container">
          <form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-4 w-100 px-3">
            <Search className="text-muted d-none d-md-block" size={32} />
            <input 
              type="text" 
              className="form-control border-0 shadow-none fs-2 px-0 fw-light" 
              placeholder="Search anything..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
            />
            <button type="button" className="btn btn-link text-dark p-0" onClick={toggleSearch}>
              <X size={32} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Navbar;
