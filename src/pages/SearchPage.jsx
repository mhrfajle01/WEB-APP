import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { searchPosts } from "../services/blogService";
import BlogCard from "../components/blog/BlogCard";
import Sidebar from "../components/sidebar/Sidebar";
import SEOHead from "../components/common/SEOHead";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const fetchResults = useCallback(async () => {
    try {
      const data = await searchPosts(query);
      setPosts(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const init = async () => {
      if (query) {
        await fetchResults();
      } else {
        setLoading(false);
      }
    };
    init();
    window.scrollTo(0, 0);
  }, [query, fetchResults]);


  return (
    <div className="pb-5" style={{ paddingTop: 'calc(var(--header-height) + 2rem)' }}>
      <SEOHead 
        title={`Search results for "${query}"`} 
        description={`Found ${posts.length} articles matching your search.`} 
      />
      
      <div className="container">
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm mb-5 border">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="bg-primary p-2 rounded-3 text-white"><Search size={24} /></div>
            <h1 className="h2 fw-bold display-font mb-0">Search Results</h1>
          </div>
          <p className="text-muted mb-0">Showing results for: <span className="text-primary fw-bold">"{query}"</span></p>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="blog-list">
                {posts.length > 0 ? (
                  posts.map((post) => <BlogCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-5 card border-0 shadow-sm rounded-4 border">
                    <p className="text-muted mb-0">No articles found matching your criteria. Try different keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-lg-4 d-lg-none">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
