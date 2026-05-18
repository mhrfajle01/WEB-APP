
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-white py-5 mb-5 border-bottom overflow-hidden position-relative" style={{ paddingTop: 'var(--header-height)' }}>
      <div className="container position-relative z-1 py-4">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold small mb-4 text-uppercase tracking-wider">
              Premium Blog Platform
            </span>
            <h1 className="display-3 fw-bold mb-4 display-font lh-sm">
              Explore the World of <span className="text-primary text-gradient">Modern Ideas</span>
            </h1>
            <p className="lead text-muted mb-5 lh-lg">
              Discover insightful articles on technology, lifestyle, and business. 
              Join our community of readers and stay updated with the latest trends.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center transition hover-scale">
                Start Reading <ArrowRight size={20} className="ms-2" />
              </button>
              <button className="btn btn-outline-dark btn-lg rounded-pill px-5 py-3 fw-bold transition hover-scale">
                Learn More
              </button>
            </div>
            
            <div className="row mt-5 pt-3 g-4">
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="text-primary me-2"><Zap size={20} /></div>
                  <span className="fw-bold small">Fast Loading</span>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="text-success me-2"><Shield size={20} /></div>
                  <span className="fw-bold small">SEO Ready</span>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="text-info me-2"><Globe size={20} /></div>
                  <span className="fw-bold small">Responsive</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="bg-primary rounded-4 shadow-lg overflow-hidden position-relative" style={{ height: "450px" }}>
                <img 
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Hero" 
                  className="w-100 h-100 object-fit-cover opacity-75"
                />
                <div className="position-absolute bottom-0 start-0 p-4 text-white w-100 bg-gradient-dark">
                  <span className="badge bg-white text-dark mb-2">Featured Post</span>
                  <h3 className="fw-bold display-font">The Future of Web Development in 2026</h3>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="position-absolute top-0 end-0 mt-n3 me-n3 bg-warning rounded-circle shadow" style={{ width: "80px", height: "80px" }}></div>
              <div className="position-absolute bottom-0 start-0 mb-n4 ms-n4 bg-info rounded-3 shadow rotate-12" style={{ width: "100px", height: "100px" }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-05 pointer-events-none">
        <div className="position-absolute top-0 end-0 translate-middle-y translate-middle-x" style={{ width: "600px", height: "600px", background: "radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)" }}></div>
      </div>

      <style>{`
        .bg-primary-subtle { background-color: #e7f1ff; }
        .text-gradient { background: linear-gradient(45deg, var(--bs-primary), #0dcaf0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-gradient-dark { background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
        .rotate-12 { transform: rotate(12deg); }
        .opacity-05 { opacity: 0.05; }
        .hover-scale:hover { transform: scale(1.05); }
        .transition { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default HeroSection;
