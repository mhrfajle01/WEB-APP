import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSkeleton from "./components/common/LoadingSkeleton";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Suspense fallback={<LoadingSkeleton />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog/:slug" element={<BlogDetails />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Protected Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
