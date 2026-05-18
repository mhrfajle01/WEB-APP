import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginWithGoogle, signupWithEmail } from "../services/authService";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import SEOHead from "../components/common/SEOHead";
import toast from "react-hot-toast";

const SignUp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      await loginWithGoogle();
      toast.success("Welcome!");
    } catch (error) {
      toast.error("Google login failed.");
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signupWithEmail(email, password, displayName);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message || "Sign up failed.");
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="container py-5 mt-4">
      <SEOHead title="Sign Up" description="Create an account to join our community." />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary p-5 text-center text-white position-relative">
              <h2 className="display-font fw-bold mb-0">Create Account</h2>
              <p className="opacity-75 small">Join our community today</p>
              <div className="position-absolute bottom-0 start-0 w-100 bg-white" style={{ height: "20px", borderRadius: "100% 100% 0 0" }}></div>
            </div>
            <div className="card-body p-5 pt-2">
              <form onSubmit={handleSignup} className="mb-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><UserIcon size={18} className="text-muted" /></span>
                    <input 
                      type="text" 
                      className="form-control bg-light border-0" 
                      placeholder="John Doe" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                    <input 
                      type="email" 
                      className="form-control bg-light border-0" 
                      placeholder="email@example.com" 
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
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                  disabled={authLoading}
                >
                  {authLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Sign Up"}
                  {!authLoading && <ArrowRight size={18} className="ms-2" />}
                </button>
              </form>

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
              
              <div className="text-center">
                <p className="text-muted small mb-0">
                  Already have an account?
                  <Link to="/login" className="btn btn-link text-primary p-0 ms-2 small fw-bold text-decoration-none">
                    Login here
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

export default SignUp;
