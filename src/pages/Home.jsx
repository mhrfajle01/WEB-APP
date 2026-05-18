import { useState, useEffect, useCallback, Fragment } from "react";
import { getPosts } from "../services/blogService";
import BlogCard from "../components/blog/BlogCard";
import Sidebar from "../components/sidebar/Sidebar";
import HeroSection from "../components/common/HeroSection";
import SEOHead from "../components/common/SEOHead";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import AdBanner from "../components/ads/AdBanner";
import { ChevronDown } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts(null, 10);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchPosts();
    };
    init();
  }, [fetchPosts]);

  return (
    <div>
      <SEOHead 
        title="Home" 
        description="Welcome to Modern Blog, your source for the latest in tech, lifestyle, and business." 
      />
      
      <HeroSection />

      <div className="container pb-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h2 className="fw-bold display-font mb-0">Latest Articles</h2>
                <div className="bg-primary rounded-pill" style={{ height: "4px", width: "40px", marginTop: "8px" }}></div>
              </div>
              <div className="dropdown">
                <button className="btn btn-light btn-sm rounded-pill px-3 dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                  Sort By: Newest
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                  <li><a className="dropdown-item small" href="#">Newest First</a></li>
                  <li><a className="dropdown-item small" href="#">Oldest First</a></li>
                  <li><a className="dropdown-item small" href="#">Most Popular</a></li>
                </ul>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="blog-list">
                {posts.length > 0 ? (
                  <>
                    {posts.map((post, index) => (
                      <Fragment key={post.id}>
                        <BlogCard post={post} />
                        {index === 1 && (
                          <AdBanner label="In-feed Ad Slot" height="150px" />
                        )}
                      </Fragment>
                    ))}
                    
                    <div className="text-center mt-5">
                      <button className="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold d-flex align-items-center mx-auto transition hover-scale">
                        Load More Posts <ChevronDown size={18} className="ms-2" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5 card border-0 shadow-sm rounded-4">
                    <p className="text-muted mb-0">No posts available yet. Check back soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
      
      <style>{`
        .hover-scale:hover { transform: scale(1.02); }
        .transition { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default Home;
