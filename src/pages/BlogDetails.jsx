import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostBySlug, likePost, unlikePost } from "../services/blogService";
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
  Linkedin,
  Heart,
  Edit3
} from "lucide-react";
import AdBanner from "../components/ads/AdBanner";
import ReadingProgressBar from "../components/common/ReadingProgressBar";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

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

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this post.");
      return navigate("/login");
    }

    if (isLiking) return;

    let isMounted = true;
    setIsLiking(true);
    const hasLiked = post.likes?.includes(user.uid);

    try {
      if (hasLiked) {
        await unlikePost(post.id, user.uid);
        if (isMounted) {
          setPost(prev => ({
            ...prev,
            likes: prev.likes.filter(id => id !== user.uid),
            likeCount: Math.max(0, (prev.likeCount || 0) - 1)
          }));
        }
      } else {
        await likePost(post.id, user.uid);
        if (isMounted) {
          setPost(prev => ({
            ...prev,
            likes: [...(prev.likes || []), user.uid],
            likeCount: (prev.likeCount || 0) + 1
          }));
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error("Failed to update like.");
      }
    } finally {
      if (isMounted) setIsLiking(false);
    }
    return () => { isMounted = false; };
  };

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

  const sanitizedContent = DOMPurify.sanitize(post.content || "");
  const formattedDate = post.createdAt?.seconds 
    ? format(post.createdAt.seconds * 1000, "MMMM dd, yyyy") 
    : "Recently Published";

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="pb-5">
      <ReadingProgressBar />
      <SEOHead 
        title={post.title} 
        description={post.metaDescription} 
        image={post.coverImage} 
        slug={`blog/${post.slug}`} 
        article={true} 
      />

      {/* Admin Quick Edit Button */}
      {isAdmin && (
        <Link 
          to={`/admin/edit/${post.id}`}
          className="btn btn-primary rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center p-0"
          style={{ 
            bottom: '30px', 
            right: '30px', 
            width: '60px', 
            height: '60px', 
            zIndex: 1050,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Edit this post"
        >
          <Edit3 size={24} />
        </Link>
      )}

      {/* Header Image */}
      <div className="blog-hero position-relative mb-5">
        <img 
          src={post.coverImage || "https://via.placeholder.com/1600x900"} 
          className="w-100 h-100 object-fit-cover shadow-sm" 
          alt={post.title} 
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-3 p-md-5 bg-gradient-dark text-white">
          <div className="container">
            <Link to={`/category/${post.category}`} className="badge bg-primary px-3 py-2 rounded-pill text-uppercase small fw-bold mb-3 text-decoration-none text-white">
              {post.category}
            </Link>
            <h1 className="blog-title fw-bold display-font mb-4 lh-sm">{post.title}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 small opacity-75">
              <div className="d-flex align-items-center"><Calendar size={16} className="me-2" /> {formattedDate}</div>
              <div className="d-flex align-items-center"><User size={16} className="me-2" /> By Admin</div>
              <div className="d-flex align-items-center"><MessageCircle size={16} className="me-2" /> 0 Comments</div>
              <button 
                onClick={handleLike}
                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center transition ${post.likes?.includes(user?.uid) ? "btn-danger" : "btn-outline-light"}`}
                disabled={isLiking}
              >
                <Heart size={16} className={`me-2 ${post.likes?.includes(user?.uid) ? "fill-white" : ""}`} /> 
                {post.likeCount || 0} Likes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <article className="bg-white p-3 p-md-5 rounded-4 shadow-sm mb-5 border">
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
            <div className="bg-white border p-4 rounded-4 mb-5 shadow-sm">
              <div className="d-flex align-items-center gap-3 gap-md-4">
                <img src="https://via.placeholder.com/100" className="rounded-circle shadow-sm author-img border" width="80" height="80" alt="Admin" />
                <div>
                  <h6 className="fw-bold mb-1">Written by Admin</h6>
                  <p className="text-muted small mb-0">
                    A passionate writer and developer sharing thoughts on modern technology and lifestyle.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="d-flex justify-content-between mb-5 mb-lg-0">
              <Link to="/" className="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center fw-bold transition hover-scale">
                <ChevronLeft size={18} className="me-2" /> Back to Home
              </Link>
            </div>
          </div>

          <div className="col-lg-4 d-lg-none">
            <Sidebar />
          </div>
        </div>
      </div>

      <style>{`
        .blog-hero { height: 500px; }
        .blog-title { font-size: 3.5rem; }
        .bg-gradient-dark { background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
        .blog-content { font-size: 1.15rem; color: #333; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content h2, .blog-content h3 { font-family: 'Playfair Display', serif; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .hover-primary:hover { color: var(--bs-primary) !important; }
        .hover-scale:hover { transform: scale(1.02); }
        .transition { transition: all 0.3s ease; }
        .tracking-wider { letter-spacing: 0.1em; }

        @media (max-width: 768px) {
          .blog-hero { height: 350px; }
          .blog-title { font-size: 2rem; }
          .blog-content { font-size: 1.05rem; }
          .author-img { width: 60px; height: 60px; }
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
