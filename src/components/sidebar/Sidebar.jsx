import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, Mail, Tag } from "lucide-react";
import AdBannerSidebar from "../ads/AdBannerSidebar";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const categories = [
    { name: "Technology", slug: "tech", count: 12 },
    { name: "Lifestyle", slug: "lifestyle", count: 8 },
    { name: "Business", slug: "business", count: 5 },
    { name: "Travel", slug: "travel", count: 7 },
  ];

  const tags = ["React", "Firebase", "Web Design", "SEO", "Bootstrap", "Google Ads", "Vite", "JavaScript"];

  return (
    <div className="sidebar">
      {/* Search Widget */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h6 className="fw-bold mb-3">Search</h6>
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <input 
              type="text" 
              className="form-control bg-light border-0" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" type="submit"><Search size={18} /></button>
          </div>
        </form>
      </div>

      {/* Ad Widget */}
      <AdBannerSidebar />

      {/* Categories Widget */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 mt-4">
        <h6 className="fw-bold mb-3">Categories</h6>
        <ul className="list-unstyled mb-0">
          {categories.map((cat) => (
            <li key={cat.slug} className="mb-2">
              <Link 
                to={`/category/${cat.slug}`} 
                className="text-decoration-none text-muted d-flex justify-content-between align-items-center hover-primary transition py-1"
              >
                <span><ChevronRight size={14} className="me-2" /> {cat.name}</span>
                <span className="badge bg-light text-muted rounded-pill small">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Widget */}
      <div className="card bg-primary text-white border-0 shadow-sm rounded-4 p-4 mb-4 overflow-hidden position-relative">
        <div className="position-relative z-1">
          <h6 className="fw-bold mb-3">Newsletter</h6>
          <p className="small opacity-75 mb-4">Join 5,000+ subscribers and get fresh content weekly.</p>
          <form className="mb-2">
            <div className="mb-3">
              <input type="email" className="form-control bg-white bg-opacity-10 border-white border-opacity-25 text-white placeholder-white" placeholder="Email address" />
            </div>
            <button className="btn btn-white w-100 fw-bold d-flex align-items-center justify-content-center">
              <Mail size={16} className="me-2" /> Join Now
            </button>
          </form>
        </div>
        <div className="position-absolute bottom-0 end-0 opacity-10" style={{ transform: "translate(20%, 20%)" }}>
          <Mail size={120} />
        </div>
      </div>

      {/* Tags Widget */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h6 className="fw-bold mb-3">Popular Tags</h6>
        <div className="d-flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag} to={`/search?q=${tag}`} className="btn btn-light btn-sm rounded-pill px-3 py-1 text-muted small border-0 transition hover-primary-bg hover-white">
              <Tag size={12} className="me-1" /> {tag}
            </Link>
          ))}
        </div>
      </div>
      
      <style>{`
        .placeholder-white::placeholder { color: rgba(255,255,255,0.7); }
        .btn-white { background-color: white; color: var(--bs-primary); border: none; }
        .btn-white:hover { background-color: rgba(255,255,255,0.9); }
        .hover-primary-bg:hover { background-color: var(--bs-primary) !important; }
        .hover-white:hover { color: white !important; }
      `}</style>
    </div>
  );
};

export default Sidebar;
