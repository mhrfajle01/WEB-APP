import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  getPosts, 
  deletePost 
} from "../../services/blogService";
import { deleteImage } from "../../services/storageService";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Search,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts(null, 50);
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

  const handleDelete = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deletePost(post.id);
        if (post.coverImagePath) {
          await deleteImage(post.coverImagePath);
        }
        setPosts(posts.filter(p => p.id !== post.id));
      } catch (error) {
        console.error("Failed to delete post", error);
        alert("Error deleting post.");
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Posts</h2>
          <p className="text-muted small mb-0">Manage all your blog content in one place.</p>
        </div>
        <Link to="/admin/new" className="btn btn-primary d-flex align-items-center px-4 rounded-3 shadow-sm py-2">
          <Plus size={18} className="me-2" /> New Post
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white p-4 border-0">
          <div className="input-group">
            <span className="input-group-text bg-light border-0"><Search size={18} className="text-muted" /></span>
            <input 
              type="text" 
              className="form-control bg-light border-0 py-2 ps-2" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-uppercase small fw-bold text-muted border-0">Post</th>
                <th className="px-4 py-3 text-uppercase small fw-bold text-muted border-0">Category</th>
                <th className="px-4 py-3 text-uppercase small fw-bold text-muted border-0">Date</th>
                <th className="px-4 py-3 text-uppercase small fw-bold text-muted border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <tr key={post.id} className="transition">
                  <td className="px-4 py-4">
                    <div className="d-flex align-items-center">
                      <img 
                        src={post.coverImage || "https://via.placeholder.com/60"} 
                        alt="" 
                        className="rounded-3 me-3" 
                        width="60" 
                        height="40"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-1 fw-bold">{post.title}</h6>
                        <span className="text-muted small">/{post.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge bg-light text-dark px-3 py-2 rounded-pill fw-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted small">
                    {post.createdAt?.seconds ? format(post.createdAt.seconds * 1000, "MMM dd, yyyy") : "Draft"}
                  </td>
                  <td className="px-4 py-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link to={`/blog/${post.slug}`} target="_blank" className="btn btn-light btn-sm rounded-3 p-2 text-primary" title="Preview">
                        <ExternalLink size={18} />
                      </Link>
                      <Link to={`/admin/edit/${post.id}`} className="btn btn-light btn-sm rounded-3 p-2 text-info" title="Edit">
                        <Edit3 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post)} 
                        className="btn btn-light btn-sm rounded-3 p-2 text-danger" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="text-muted mb-2"><AlertCircle size={40} className="opacity-25" /></div>
                    <p className="text-muted">No posts found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostList;
