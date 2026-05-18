import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import { Mail, Lock, ArrowRight, ShieldCheck, User as UserIcon } from "lucide-react";
import SEOHead from "../components/common/SEOHead";
import toast from "react-hot-toast";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user"); // "user" or "admin"

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      await loginWithGoogle();
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Google login failed.");
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success(activeTab === "admin" ? "Admin logged in successfully!" : "Logged in successfully!");
    } catch (error) {
      toast.error(error.message || "Authentication failed.");
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="container py-5 mt-4">
      <SEOHead title={activeTab === "admin" ? "Admin Login" : "User Login"} description="Log in to your account." />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header */}
            <div className={`p-5 text-center text-white position-relative transition ${activeTab === "admin" ? "bg-dark" : "bg-primary"}`}>
              <h2 className="display-font fw-bold mb-0">
                {activeTab === "admin" ? "Admin Panel" : "Welcome Back"}
              </h2>
              <p className="opacity-75 small">
                {activeTab === "admin" ? "Secure administrative access" : "Log in to your account"}
              </p>
              <div className="position-absolute bottom-0 start-0 w-100 bg-white" style={{ height: "20px", borderRadius: "100% 100% 0 0" }}></div>
            </div>

            <div className="card-body p-5 pt-2">
              {/* Tabs */}
              <div className="d-flex mb-4 bg-light p-1 rounded-pill">
                <button 
                  className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition ${activeTab === "user" ? "btn-primary shadow-sm" : "btn-link text-muted text-decoration-none"}`}
                  onClick={() => setActiveTab("user")}
                >
                  <UserIcon size={16} className="me-2" /> User Login
                </button>
                <button 
                  className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition ${activeTab === "admin" ? "btn-dark shadow-sm" : "btn-link text-muted text-decoration-none"}`}
                  onClick={() => setActiveTab("admin")}
                >
                  <ShieldCheck size={16} className="me-2" /> Admin Login
                </button>
              </div>

              <form onSubmit={handleLogin} className="mb-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                    <input 
                      type="email" 
                      className="form-control bg-light border-0" 
                      placeholder={activeTab === "admin" ? "admin@example.com" : "user@example.com"} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Lock size={18} className="text-muted" /></span>
                    <input 
                      type="password" 
                      className="form-control bg-light border-0" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className={`btn w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center transition ${activeTab === "admin" ? "btn-dark" : "btn-primary"}`}
                  disabled={authLoading}
                >
                  {authLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Log In"}
                  {!authLoading && <ArrowRight size={18} className="ms-2" />}
                </button>
              </form>

              {activeTab === "user" && (
                <>
                  <div className="position-relative mb-4 text-center">
                    <hr className="opacity-10" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">OR</span>
                  </div>

                  <button 
                    className="btn btn-outline-dark w-100 py-3 rounded-pill d-flex align-items-center justify-content-center fw-bold transition mb-4"
                    onClick={handleGoogleLogin}
                    disabled={authLoading}
                    type="button"
                  >
                    <img 
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                      alt="Google" 
                      className="me-2" 
                      width="20" 
                    />
                    Continue with Google
                  </button>
                </>
              )}
              
              <div className="text-center">
                <p className="text-muted small mb-0">
                  Don't have an account?
                  <Link to="/signup" className="btn btn-link text-primary p-0 ms-2 small fw-bold text-decoration-none">
                    Sign up here
                  </Link>
                </p>
              </div>
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
