
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  Users,
  Settings as SettingsIcon,
  ChevronRight,
  Menu,
  X as CloseIcon,
  ExternalLink,
  LogOut
} from "lucide-react";
import { useState, lazy, Suspense, useEffect } from "react";
import SEOHead from "../components/common/SEOHead";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/authService";
import toast from "react-hot-toast";

const PostList = lazy(() => import("./admin/PostList"));
const PostEditor = lazy(() => import("./admin/PostEditor"));
const UserList = lazy(() => import("./admin/UserList"));
const Settings = lazy(() => import("./Settings"));

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { path: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard", end: true },
    { path: "/admin/posts", icon: <Files size={18} />, label: "Content" },
    { path: "/admin/new", icon: <FilePlus size={18} />, label: "New Post" },
    { path: "/admin/users", icon: <Users size={18} />, label: "Community" },
    { path: "/admin/settings", icon: <SettingsIcon size={18} />, label: "Settings" },
  ];

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(p => p !== "");
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { url, label };
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="admin-layout bg-light min-vh-100 d-flex">
      <SEOHead title="Admin Panel" description="Professional admin dashboard for managing content." />
      
      {/* Sidebar */}
      <aside className={`admin-sidebar bg-white border-end transition-all ${isSidebarOpen ? "expanded" : "collapsed"} d-none d-lg-flex flex-column`}>
        <div className="p-4 d-flex align-items-center gap-3 mb-4">
          <div className="bg-primary rounded-3 p-2 text-white">
            <LayoutDashboard size={24} />
          </div>
          <div className={`transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 d-none"}`}>
            <h5 className="fw-bold mb-0">Admin</h5>
            <small className="text-muted">v1.0.0</small>
          </div>
        </div>

        <nav className="flex-grow-1 px-3">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`nav-link-item d-flex align-items-center mb-1 py-2 px-3 rounded-3 transition ${
                isActive(link.path, link.end) ? "active shadow-sm" : "text-muted"
              }`}
            >
              <span className="icon-wrapper me-3">{link.icon}</span>
              <span className={`label transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 d-none"}`}>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-top mt-auto">
          <div className="d-flex align-items-center gap-3 p-2 mb-2">
            <img 
              src={user?.photoURL || "https://via.placeholder.com/32"} 
              className="rounded-circle border" 
              width="32" 
              height="32" 
              alt="Profile" 
            />
            <div className={`transition-opacity overflow-hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 d-none"}`}>
              <p className="fw-bold mb-0 text-truncate small">{user?.displayName || "Admin User"}</p>
              <p className="text-muted mb-0 text-truncate x-small">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center">
            <LogOut size={16} className={isSidebarOpen ? "me-2" : ""} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 z-1040" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="mobile-sidebar bg-white h-100 p-4 shadow-lg animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h5 className="fw-bold mb-0">Menu</h5>
              <button className="btn btn-light rounded-circle" onClick={() => setIsMobileMenuOpen(false)}>
                <CloseIcon size={20} />
              </button>
            </div>
            <nav className="mb-5">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`nav-link-item d-flex align-items-center mb-3 py-3 px-4 rounded-4 transition ${
                    isActive(link.path, link.end) ? "active shadow-sm" : "text-muted bg-light"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="me-3">{link.icon}</span>
                  <span className="fw-bold">{link.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <Link to="/" className="btn btn-light w-100 rounded-4 py-3 mb-2 d-flex align-items-center justify-content-center">
                <ExternalLink size={18} className="me-2" /> View Site
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-4 py-3">Logout</button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-hidden d-flex flex-column">
        {/* Top Header */}
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center sticky-top z-1030">
          <div className="d-flex align-items-center">
            <button className="btn btn-light d-none d-lg-flex me-3 rounded-circle p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <button className="btn btn-light d-lg-none me-3 rounded-circle p-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            
            <nav aria-label="breadcrumb" className="d-none d-md-block">
              <ol className="breadcrumb mb-0">
                {getBreadcrumbs().map((crumb, i) => (
                  <li key={i} className={`breadcrumb-item d-flex align-items-center ${i === getBreadcrumbs().length - 1 ? "active text-primary fw-bold" : "text-muted"}`}>
                    {i !== 0 && <ChevronRight size={14} className="mx-2 opacity-50" />}
                    {i === getBreadcrumbs().length - 1 ? crumb.label : <Link to={crumb.url} className="text-decoration-none text-muted">{crumb.label}</Link>}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-light btn-sm rounded-pill px-3 d-none d-md-flex align-items-center">
              <ExternalLink size={14} className="me-2" /> Live Site
            </Link>
            <div className="v-divider mx-1 d-none d-md-block"></div>
            <div className="dropdown">
              <button className="btn border-0 p-0 rounded-circle overflow-hidden shadow-sm" type="button" data-bs-toggle="dropdown">
                <img src={user?.photoURL || "https://via.placeholder.com/36"} width="36" height="36" alt="" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2 mt-2">
                <li className="px-3 py-2 border-bottom mb-2">
                  <p className="fw-bold mb-0 small">{user?.displayName}</p>
                  <p className="text-muted mb-0 x-small">{user?.email}</p>
                </li>
                <li><Link className="dropdown-item rounded-3" to="/admin/settings">Profile Settings</Link></li>
                <li><button className="dropdown-item rounded-3 text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="content-container p-3 p-md-4 p-lg-5 overflow-auto">
          <Suspense fallback={<div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/new" element={<PostEditor />} />
              <Route path="/edit/:id" element={<PostEditor />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <style>{`
        .admin-layout { height: 100vh; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .admin-sidebar { width: 280px; flex-shrink: 0; }
        .admin-sidebar.collapsed { width: 80px; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .nav-link-item { color: #64748b; text-decoration: none; font-size: 0.95rem; font-weight: 500; }
        .nav-link-item:hover { background-color: #f1f5f9; color: #0f172a; }
        .nav-link-item.active { background-color: #0d6efd; color: #fff !important; }
        .nav-link-item.active .icon-wrapper { color: #fff; }
        
        .x-small { font-size: 0.75rem; }
        .v-divider { width: 1px; height: 24px; background-color: #e2e8f0; }
        .z-1040 { z-index: 1040; }
        .z-1030 { z-index: 1030; }
        
        .mobile-sidebar { width: 300px; }
        .animate-slide-in { animation: slideRight 0.3s ease-out; }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .breadcrumb-item + .breadcrumb-item::before { display: none; }
        .content-container { max-width: 1600px; margin: 0 auto; width: 100%; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f8f9fa; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        @media (max-width: 991.98px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
