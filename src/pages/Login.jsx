import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginWithGoogle } from "../services/authService";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import SEOHead from "../components/common/SEOHead";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) return null;

  return (
    <div className="container py-5 mt-5">
      <SEOHead title="Login" description="Login to your account to manage your blog." />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary p-5 text-center text-white">
              <h2 className="display-font fw-bold mb-0">Welcome Back</h2>
              <p className="opacity-75 small">Log in to access your dashboard</p>
            </div>
            <div className="card-body p-5">
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light p-2 rounded-3 me-3 text-primary"><ShieldCheck size={20} /></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Secure Access</h6>
                    <p className="text-muted small mb-0">Your data is protected by Firebase.</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light p-2 rounded-3 me-3 text-success"><Zap size={20} /></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Fast Experience</h6>
                    <p className="text-muted small mb-0">Optimized for speed and efficiency.</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-light p-2 rounded-3 me-3 text-info"><Globe size={20} /></div>
                  <div>
                    <h6 className="mb-0 fw-bold">Global Content</h6>
                    <p className="text-muted small mb-0">Reach readers across the world.</p>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-outline-dark w-100 py-3 rounded-pill d-flex align-items-center justify-content-center fw-bold transition"
                onClick={handleLogin}
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="me-2" 
                  width="20" 
                />
                Continue with Google
              </button>
              
              <p className="text-center text-muted small mt-4 mb-0">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .transition { transition: all 0.3s ease; }
        .btn-outline-dark:hover { background-color: #f8f9fa; color: #000; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default Login;
