import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../services/blogService";
import BlogCard from "../components/blog/BlogCard";
import Sidebar from "../components/sidebar/Sidebar";
import SEOHead from "../components/common/SEOHead";
import LoadingSkeleton from "../components/common/LoadingSkeleton";

const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts(category, 20);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    const init = async () => {
      await fetchPosts();
    };
    init();
    window.scrollTo(0, 0);
  }, [fetchPosts]);

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="py-5">
      <SEOHead 
        title={`${categoryName} Articles`} 
        description={`Browse our collection of articles about ${categoryName}.`} 
      />
      
      <div className="container">
        <div className="bg-white p-5 rounded-4 shadow-sm mb-5 border-start border-primary border-5">
          <h1 className="display-4 fw-bold display-font mb-2">{categoryName}</h1>
          <p className="text-muted mb-0">Exploring the best in {categoryName} from around the web.</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="blog-list">
                {posts.length > 0 ? (
                  posts.map((post) => <BlogCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-5 card border-0 shadow-sm rounded-4">
                    <p className="text-muted mb-0">No posts found in this category.</p>
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
    </div>
  );
};

export default CategoryPage;
