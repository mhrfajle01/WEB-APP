
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  Settings, 
  ExternalLink
} from "lucide-react";
import PostList from "./admin/PostList";
import PostEditor from "./admin/PostEditor";
import SEOHead from "../components/common/SEOHead";

const AdminDashboard = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true },
    { path: "/admin/posts", icon: <Files size={20} />, label: "All Posts" },
    { path: "/admin/new", icon: <FilePlus size={20} />, label: "New Post" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="container-fluid g-0">
      <SEOHead title="Admin Dashboard" description="Manage your blog posts and settings." />
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-white border-end min-vh-100 d-none d-md-block pt-4">
          <div className="px-4 mb-5">
            <h5 className="fw-bold display-font">Admin Panel</h5>
            <p className="text-muted small">Manage your content</p>
          </div>
          
          <div className="nav flex-column nav-pills px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`nav-link d-flex align-items-center mb-2 py-3 px-4 rounded-3 transition ${
                  isActive(link.path, link.end) ? "bg-primary text-white shadow-sm" : "text-dark hover-light"
                }`}
              >
                <span className="me-3">{link.icon}</span>
                <span className="fw-medium">{link.label}</span>
              </Link>
            ))}
            
            <hr className="my-4 mx-3 opacity-10" />
            
            <Link to="/" className="nav-link text-muted d-flex align-items-center px-4 hover-light transition">
              <span className="me-3"><ExternalLink size={20} /></span>
              <span>View Site</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 bg-light p-4 p-lg-5">
          {/* Mobile Header */}
          <div className="d-md-none bg-white p-3 rounded-3 mb-4 shadow-sm">
            <h5 className="fw-bold display-font mb-0">Admin Panel</h5>
          </div>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/new" element={<PostEditor />} />
              <Route path="/edit/:id" element={<PostEditor />} />
              <Route path="/settings" element={<div className="text-center py-5">Settings coming soon...</div>} />
            </Routes>
          </div>
        </div>
      </div>

      <style>{`
        .transition { transition: all 0.2s ease; }
        .hover-light:hover { background-color: #f8f9fa; }
        .nav-link { font-size: 0.95rem; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
