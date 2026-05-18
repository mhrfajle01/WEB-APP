import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug } from "../services/blogService";
import SEOHead from "../components/common/SEOHead";
import Sidebar from "../components/sidebar/Sidebar";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { 
  Calendar, 
  User, 
  Tag, 
  MessageCircle,
  ChevronLeft,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react";
import AdBanner from "../components/ads/AdBanner";

const BlogDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const data = await getPostBySlug(slug);
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const init = async () => {
      await fetchPost();
    };
    init();
    window.scrollTo(0, 0);
  }, [fetchPost]);

  if (loading) return (
    <div className="container py-5 mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!post) return (
    <div className="container py-5 mt-5 text-center">
      <h2 className="display-font fw-bold">Post Not Found</h2>
      <p className="text-muted">The article you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4 mt-3">Back to Home</Link>
    </div>
  );

  const sanitizedContent = DOMPurify.sanitize(post.content);
  const formattedDate = post.createdAt?.seconds 
    ? format(post.createdAt.seconds * 1000, "MMMM dd, yyyy") 
    : "Recently Published";

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="pb-5">
      <SEOHead 
        title={post.title} 
        description={post.metaDescription} 
        image={post.coverImage} 
        slug={`blog/${post.slug}`} 
        article={true} 
      />

      {/* Header Image */}
      <div className="position-relative mb-5" style={{ height: "500px" }}>
        <img 
          src={post.coverImage || "https://via.placeholder.com/1600x900"} 
          className="w-100 h-100 object-fit-cover shadow-sm" 
          alt={post.title} 
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5 bg-gradient-dark text-white">
          <div className="container">
            <Link to={`/category/${post.category}`} className="badge bg-primary px-3 py-2 rounded-pill text-uppercase small fw-bold mb-3 text-decoration-none text-white">
              {post.category}
            </Link>
            <h1 className="display-3 fw-bold display-font mb-4 lh-sm">{post.title}</h1>
            <div className="d-flex align-items-center gap-4 small opacity-75">
              <div className="d-flex align-items-center"><Calendar size={16} className="me-2" /> {formattedDate}</div>
              <div className="d-flex align-items-center"><User size={16} className="me-2" /> By Admin</div>
              <div className="d-flex align-items-center"><MessageCircle size={16} className="me-2" /> 0 Comments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <article className="bg-white p-4 p-md-5 rounded-4 shadow-sm mb-5">
              {/* Content */}
              <div 
                className="blog-content lh-lg"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              <hr className="my-5 opacity-10" />

              {/* Tags & Share */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-4">
                <div className="d-flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag) => (
                    <span key={tag} className="badge bg-light text-muted px-3 py-2 rounded-pill small">
                      <Tag size={12} className="me-1" /> {tag}
                    </span>
                  ))}
                </div>
                
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold small text-uppercase tracking-wider text-muted">Share:</span>
                  <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" className="text-muted hover-primary transition"><Twitter size={20} /></a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="text-muted hover-primary transition"><Facebook size={20} /></a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" className="text-muted hover-primary transition"><Linkedin size={20} /></a>
                </div>
              </div>
            </article>

            {/* In-article Ad */}
            <AdBanner label="Post Bottom Ad Slot" height="200px" />

            {/* Author Box */}
            <div className="bg-light p-4 rounded-4 mb-5 border-start border-primary border-5 shadow-sm">
              <div className="d-flex align-items-center gap-4">
                <img src="https://via.placeholder.com/100" className="rounded-circle shadow-sm" width="80" height="80" alt="Admin" />
                <div>
                  <h6 className="fw-bold mb-1">Written by Admin</h6>
                  <p className="text-muted small mb-0">
                    A passionate writer and developer sharing thoughts on modern technology and lifestyle. 
                    Follow for more insightful content.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="d-flex justify-content-between">
              <Link to="/" className="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center fw-bold transition hover-scale">
                <ChevronLeft size={18} className="me-2" /> Back to Home
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-dark { background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
        .blog-content { font-size: 1.15rem; color: #333; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content h2, .blog-content h3 { font-family: 'Playfair Display', serif; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .hover-primary:hover { color: var(--bs-primary) !important; }
        .hover-scale:hover { transform: scale(1.02); }
        .transition { transition: all 0.3s ease; }
        .tracking-wider { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};

export default BlogDetails;
