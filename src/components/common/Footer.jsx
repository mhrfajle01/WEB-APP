
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-4 display-font fs-3 text-primary">ModernBlog</h5>
            <p className="text-muted small lh-lg">
              A premium blogging platform for creators, thinkers, and explorers. 
              Built with passion using React and Firebase.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-muted hover-white transition"><Twitter size={20} /></a>
              <a href="#" className="text-muted hover-white transition"><Github size={20} /></a>
              <a href="#" className="text-muted hover-white transition"><Linkedin size={20} /></a>
              <a href="#" className="text-muted hover-white transition"><Mail size={20} /></a>
            </div>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none small hover-primary transition">Home</Link></li>
              <li className="mb-2"><Link to="/category/tech" className="text-muted text-decoration-none small hover-primary transition">Technology</Link></li>
              <li className="mb-2"><Link to="/category/lifestyle" className="text-muted text-decoration-none small hover-primary transition">Lifestyle</Link></li>
              <li className="mb-2"><Link to="/search" className="text-muted text-decoration-none small hover-primary transition">Search</Link></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none small hover-primary transition">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none small hover-primary transition">Contact</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none small hover-primary transition">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none small hover-primary transition">Terms of Use</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold mb-4">Subscribe to Newsletter</h6>
            <p className="text-muted small mb-4">Get the latest articles and updates delivered directly to your inbox.</p>
            <form className="d-flex gap-2">
              <input type="email" className="form-control bg-dark border-secondary text-white small" placeholder="Your email address" />
              <button type="submit" className="btn btn-primary btn-sm px-3">Subscribe</button>
            </form>
          </div>
        </div>
        
        <hr className="my-5 border-secondary" />
        
        <div className="text-center text-muted small">
          <p className="mb-0">&copy; {new Date().getFullYear()} ModernBlog. All rights reserved.</p>
        </div>
      </div>
      
      <style>{`
        .hover-white:hover { color: white !important; }
        .hover-primary:hover { color: var(--bs-primary) !important; }
        .transition { transition: all 0.3s ease; }
      `}</style>
    </footer>
  );
};

export default Footer;
