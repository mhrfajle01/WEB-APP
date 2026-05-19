
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, User, ArrowRight } from "lucide-react";

const BlogCard = ({ post }) => {
  const formattedDate = post.createdAt?.seconds 
    ? format(post.createdAt.seconds * 1000, "MMM dd, yyyy") 
    : "Recently";

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 transition-transform hover-translate-y">
      <div className="position-relative">
        <img 
          src={post.coverImage || "https://via.placeholder.com/800x450"} 
          className="card-img-top" 
          alt={post.title} 
          style={{ height: "240px", objectFit: "cover" }}
          loading="lazy"
        />
        <div className="position-absolute top-0 start-0 m-3">
          <span className="badge bg-primary px-3 py-2 rounded-pill text-uppercase small fw-bold shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 text-muted small mb-3">
          <div className="d-flex align-items-center"><Calendar size={14} className="me-1" /> {formattedDate}</div>
          <div className="d-flex align-items-center"><User size={14} className="me-1" /> Admin</div>
        </div>
        <h4 className="card-title fw-bold mb-3 display-font">
          <Link to={`/blog/${post.slug || post.id}`} className="text-dark text-decoration-none hover-primary transition">
            {post.title}
          </Link>
        </h4>
        <p className="card-text text-muted small lh-lg mb-4 summary-text-traditional">
          {post.metaDescription || (post.content ? post.content
            .replace(/<[^>]*>/g, ' ') // Strip HTML tags with space
            .replace(/&nbsp;/g, ' ')  // Replace nbsp with real space
            .replace(/\s+/g, ' ')     // Collapse multiple spaces
            .trim()
            .substring(0, 150) + "..." : "")}
        </p>
        <Link to={`/blog/${post.slug || post.id}`} className="btn btn-link text-primary p-0 text-decoration-none fw-bold small d-flex align-items-center">
          Read More <ArrowRight size={16} className="ms-2" />
        </Link>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        .hover-translate-y:hover { transform: translateY(-8px); }
        .transition-transform { transition: transform 0.3s ease; }
        .hover-primary:hover { color: var(--bs-primary) !important; }
        .summary-text-traditional { 
          font-family: 'Hind Siliguri', 'SolaimanLipi', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          overflow-wrap: break-word;
          word-break: normal;
          line-break: strict;
        }
      `}</style>
    </div>
  );
};

export default BlogCard;
