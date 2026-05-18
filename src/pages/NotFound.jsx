
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import SEOHead from "../components/common/SEOHead";

const NotFound = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <SEOHead title="404 - Not Found" description="The page you are looking for does not exist." />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="display-1 fw-bold text-primary mb-4">404</div>
          <div className="mb-4">
            <AlertTriangle size={64} className="text-warning opacity-50" />
          </div>
          <h2 className="display-font fw-bold mb-3">Oops! Page Not Found</h2>
          <p className="text-muted lead mb-5">
            The page you're looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center transition hover-scale">
            <Home size={20} className="me-2" /> Back to Home
          </Link>
        </div>
      </div>
      
      <style>{`
        .hover-scale:hover { transform: scale(1.05); }
        .transition { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default NotFound;
