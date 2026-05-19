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
  ChevronLeft,
  Twitter,
  Facebook,
  Linkedin,
  Heart,
  Edit3,
  MessageCircle
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
  const formattedDate = post.createdAt instanceof Date 
    ? format(post.createdAt, "MMMM dd, yyyy") 
    : (post.createdAt?.seconds 
        ? format(post.createdAt.seconds * 1000, "MMMM dd, yyyy") 
        : "Recently Published");

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="pb-5 bg-white">
      <ReadingProgressBar />
      <SEOHead 
        title={post.title} 
        description={post.metaDescription} 
        image={post.coverImage} 
        slug={`blog/${post.slug}`} 
        article={true} 
      />
      
      {/* Load professional Bengali font */}
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Admin Quick Edit Button */}
      {isAdmin && (
        <Link 
          to={`/admin/edit/${post.id}`}
          className="btn btn-accent rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center p-0"
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

      {/* Al-Kawsar Style Header */}
      <div className="article-header-traditional border-bottom py-4 py-md-5 mb-4 bg-light bg-opacity-50">
        <div className="container text-center">
          <Link to={`/category/${post.category}`} className="text-decoration-none text-accent fw-bold text-uppercase small tracking-widest mb-3 d-block">
            {post.category}
          </Link>
          <h1 className="blog-title-traditional display-5 fw-bold mb-4 text-dark lh-base px-2">
            {post.title}
          </h1>
          
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4 text-muted small pb-2 px-3">
            <div className="d-flex align-items-center border-end-md pe-md-3 border-secondary border-opacity-25">
              <User size={16} className="me-2 text-accent" /> Written by Admin
            </div>
            <div className="d-flex align-items-center border-end-md pe-md-3 border-secondary border-opacity-25">
              <Calendar size={16} className="me-2 text-accent" /> {formattedDate}
            </div>
            <div className="d-flex align-items-center">
              <button 
                onClick={handleLike}
                className={`btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center transition ${post.likes?.includes(user?.uid) ? "text-danger" : "text-muted"}`}
                disabled={isLiking}
              >
                <Heart size={16} className={`me-2 ${post.likes?.includes(user?.uid) ? "fill-danger" : ""}`} /> 
                {post.likeCount || 0} Likes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/* Main Featured Image */}
            <div className="mb-5 rounded-4 overflow-hidden shadow-sm border mx-2 mx-md-0">
              <img 
                src={post.coverImage || "https://via.placeholder.com/1600x900"} 
                className="w-100 h-auto object-fit-cover" 
                alt={post.title} 
                style={{ maxHeight: '500px' }}
              />
            </div>

            <article className="article-body-traditional mb-5 px-3 px-md-0">
              {/* Content */}
              <div 
                className="blog-content-traditional"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              <div className="mt-5 pt-4 border-top">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-4">
                  <div className="d-flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag) => (
                      <span key={tag} className="tag-traditional">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold small text-uppercase tracking-wider text-muted">Share:</span>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" className="text-muted hover-accent transition"><Twitter size={18} /></a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="text-muted hover-accent transition"><Facebook size={18} /></a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" className="text-muted hover-accent transition"><Linkedin size={18} /></a>
                  </div>
                </div>
              </div>
            </article>

            {/* In-article Ad */}
            <AdBanner label="Post Bottom Ad Slot" height="150px" />

            {/* Navigation */}
            <div className="text-center mt-5 mb-4">
              <Link to="/" className="btn btn-outline-accent rounded-pill px-5 py-2 fw-bold transition hover-scale">
                <ChevronLeft size={18} className="me-2" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root { --accent-color: #006400; }
        .text-accent { color: var(--accent-color); }
        .btn-accent { background-color: var(--accent-color); color: white; border: none; }
        .btn-accent:hover { background-color: #004d00; color: white; }
        .btn-outline-accent { color: var(--accent-color); border-color: var(--accent-color); }
        .btn-outline-accent:hover { background-color: var(--accent-color); color: white; }
        .hover-accent:hover { color: var(--accent-color) !important; }

        .article-header-traditional { border-top: 4px solid var(--accent-color); }
        .blog-title-traditional { 
          font-family: 'Hind Siliguri', 'SolaimanLipi', 'Siyam Rupali', sans-serif; 
          color: #1a1a1a; 
          line-height: 1.5;
        }

        .blog-content-traditional { 
          font-family: 'Hind Siliguri', 'SolaimanLipi', 'Siyam Rupali', sans-serif; 
          font-size: 1.25rem; 
          line-height: 1.8; 
          color: #2c3e50;
          text-align: left; 
          word-break: keep-all; 
          overflow-wrap: normal; /* Prevents breaking within words */
          hyphens: none;
          -webkit-hyphens: none;
          line-break: strict;
          text-rendering: optimizeLegibility; 
          -webkit-font-smoothing: antialiased;
        }

        /* Allow only links and code to wrap/break if too long */
        .blog-content-traditional a, 
        .blog-content-traditional code,
        .blog-content-traditional pre {
          overflow-wrap: break-word;
          word-break: break-all;
        }
        
        .blog-content-traditional p { 
          margin-bottom: 1.8rem;
          text-align: left; /* Ensure paragraphs don't inherit justification */
        }
        .blog-content-traditional h2, .blog-content-traditional h3 { 
          color: var(--accent-color); 
          font-weight: 700; 
          margin-top: 3rem; 
          margin-bottom: 1.5rem; 
          border-left: 5px solid var(--accent-color);
          padding-left: 1rem;
          font-family: inherit;
        }

        .blog-content-traditional img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 8px; 
          margin: 3rem auto; 
          display: block;
          border: 1px solid #eee;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* Support for Quill Text Alignment */
        .ql-align-center { text-align: center; }
        .ql-align-right { text-align: right; }
        .ql-align-justify { text-align: justify; }

        .tag-traditional {
          font-size: 0.85rem;
          color: var(--accent-color);
          background: #f0fdf4;
          padding: 4px 12px;
          border-radius: 4px;
          border: 1px solid #dcfce7;
        }

        .tracking-widest { letter-spacing: 0.2em; }
        .fill-danger { fill: #dc3545; }
        .hover-scale:hover { transform: scale(1.02); }
        .transition { transition: all 0.3s ease; }

        @media (min-width: 768px) {
          .border-end-md { border-right: 1px solid rgba(0,0,0,0.1); }
        }

        @media (max-width: 768px) {
          .blog-title-traditional { font-size: 1.8rem; }
          .blog-content-traditional { font-size: 1.15rem; text-align: left; line-height: 1.8; }
          .article-header-traditional { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
