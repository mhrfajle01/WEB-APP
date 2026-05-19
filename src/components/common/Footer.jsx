
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Volume2 } from "lucide-react";
import { getSiteSettings } from "../../services/settingsService";

const Footer = () => {
  const [scrollingText, setScrollingText] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSiteSettings();
      setScrollingText(settings.footerScrollingText || "");
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-dark text-white pt-5 pb-0 mt-auto">
      {scrollingText && (
        <div className="bg-primary py-2 overflow-hidden border-bottom border-secondary border-opacity-25">
          <div className="container-fluid">
            <div className="marquee-content d-flex align-items-center">
              <Volume2 size={16} className="me-2 text-white-50 flex-shrink-0" />
              <marquee className="small fw-medium text-white-50 mb-0">
                {scrollingText}
              </marquee>
            </div>
          </div>
        </div>
      )}

      <div className="container pt-5 pb-4">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-4 display-font fs-3 text-white">ModernBlog</h5>
            <p className="text-white-50 small lh-lg">
              A premium blogging platform for creators, thinkers, and explorers. 
              Built with passion using React and Firebase.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white-50 hover-white transition"><Twitter size={20} /></a>
              <a href="#" className="text-white-50 hover-white transition"><Github size={20} /></a>
              <a href="#" className="text-white-50 hover-white transition"><Linkedin size={20} /></a>
              <a href="#" className="text-white-50 hover-white transition"><Mail size={20} /></a>
            </div>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none small hover-primary transition">Home</Link></li>
              <li className="mb-2"><Link to="/category/tech" className="text-white-50 text-decoration-none small hover-primary transition">Technology</Link></li>
              <li className="mb-2"><Link to="/category/lifestyle" className="text-white-50 text-decoration-none small hover-primary transition">Lifestyle</Link></li>
              <li className="mb-2"><Link to="/search" className="text-white-50 text-decoration-none small hover-primary transition">Search</Link></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-4">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small hover-primary transition">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small hover-primary transition">Contact</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small hover-primary transition">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small hover-primary transition">Terms of Use</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold mb-4">Subscribe to Newsletter</h6>
            <p className="text-white-50 small mb-4">Get the latest articles and updates delivered directly to your inbox.</p>
            <form className="d-flex gap-2">
              <input type="email" className="form-control bg-dark border-secondary text-white small" placeholder="Your email address" />
              <button type="submit" className="btn btn-primary btn-sm px-3">Subscribe</button>
            </form>
          </div>
        </div>
        
        <hr className="my-5 border-secondary" />
        
        <div className="text-center text-white-50 small">
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
