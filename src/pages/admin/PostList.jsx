
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  getPosts, 
  deletePost,
  createPost
} from "../../services/blogService";
import { deleteImage } from "../../services/storageService";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  MoreVertical,
  Eye,
  Database,
  Calendar,
  Layers
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPosts = useCallback(async () => {
    let isMounted = true;
    try {
      setLoading(true);
      const data = await getPosts(null, 100, true);
      if (isMounted) setPosts(data);
    } catch (err) {
      if (err.name !== 'AbortError' && isMounted) {
        console.error("Failed to fetch posts", err);
        toast.error("Failed to load posts.");
      }
    } finally {
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cleanup = fetchPosts(); // eslint-disable-line react-hooks/set-state-in-effect
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, [fetchPosts]);

  const handleSeed = async () => {
    setSeeding(true);
    const seedToast = toast.loading("Seeding sample articles...");
    
    const samplePosts = [
      {
        title: "The Future of Web Development with React 19",
        slug: "future-of-web-dev-react-19",
        content: "<p>React 19 brings exciting features like Actions, Document Metadata, and improved hooks. It simplifies many patterns we used to struggle with.</p>",
        category: "tech",
        tags: ["React", "JavaScript", "Web Development"],
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        metaDescription: "Explore the new features in React 19.",
        status: "published"
      },
      {
        title: "Mastering Minimalist Design in 2026",
        slug: "mastering-minimalist-design-2026",
        content: "<p>Minimalism isn't just about white space; it's about intentionality. In 2026, we see a shift towards 'Warm Minimalism'.</p>",
        category: "lifestyle",
        tags: ["Design", "Minimalism", "UI/UX"],
        coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
        metaDescription: "How to apply minimalist principles in modern design.",
        status: "draft"
      }
    ];

    try {
      for (const post of samplePosts) {
        await createPost({ ...post, likes: [], likeCount: 0 });
      }
      toast.success("Sample articles added!", { id: seedToast });
      await fetchPosts();
    } catch (err) {
      console.error("Operation failed", err);
      toast.error("Seeding failed.", { id: seedToast });
    } finally {
      setSeeding(false);
    }
  };

  const [deleteModal, setDeleteModal] = useState({ show: false, post: null });

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    const post = deleteModal.post;
    const deleteToast = toast.loading("Deleting post...");
    try {
      await deletePost(post.id);
      if (post.coverImagePath) await deleteImage(post.coverImagePath);
      setPosts(prev => prev.filter(p => p.id !== post.id));
      toast.success("Post deleted", { id: deleteToast });
      setDeleteModal({ show: false, post: null });
    } catch (err) {
      console.error("Operation failed", err);
      toast.error("Delete failed", { id: deleteToast });
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = (post.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (post.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="post-list-page animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Content Management</h1>
          <p className="text-muted">You have {posts.length} posts in your library.</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={handleSeed} 
            disabled={seeding} 
            className="btn btn-white border shadow-sm d-flex align-items-center px-3 rounded-3"
          >
            {seeding ? <span className="spinner-border spinner-border-sm me-2"></span> : <Database size={16} className="me-2 text-primary" />}
            Seed Data
          </button>
          <Link to="/admin/new" className="btn btn-primary d-flex align-items-center px-4 rounded-3 shadow-sm">
            <Plus size={18} className="me-2" /> Create Post
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white p-4 border-0">
          <div className="row g-3 align-items-center">
            <div className="col-md-6 col-lg-4">
              <div className="input-group search-group bg-light rounded-3 px-2">
                <span className="input-group-text bg-transparent border-0"><Search size={18} className="text-muted" /></span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 py-2" 
                  placeholder="Search posts or categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-8">
              <div className="d-flex justify-content-md-end gap-2">
                <div className="btn-group rounded-3 overflow-hidden border shadow-sm">
                  <button 
                    className={`btn btn-sm px-3 ${statusFilter === "all" ? "btn-dark" : "btn-white"}`}
                    onClick={() => setStatusFilter("all")}
                  >All</button>
                  <button 
                    className={`btn btn-sm px-3 ${statusFilter === "published" ? "btn-dark" : "btn-white"}`}
                    onClick={() => setStatusFilter("published")}
                  >Published</button>
                  <button 
                    className={`btn btn-sm px-3 ${statusFilter === "draft" ? "btn-dark" : "btn-white"}`}
                    onClick={() => setStatusFilter("draft")}
                  >Drafts</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light-header">
              <tr>
                <th className="ps-4 py-3 text-uppercase x-small fw-bold text-muted border-0">Post Details</th>
                <th className="py-3 text-uppercase x-small fw-bold text-muted border-0">Status</th>
                <th className="py-3 text-uppercase x-small fw-bold text-muted border-0">Category</th>
                <th className="py-3 text-uppercase x-small fw-bold text-muted border-0">Date</th>
                <th className="pe-4 py-3 text-uppercase x-small fw-bold text-muted border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <tr key={post.id} className="post-row">
                  <td className="ps-4 py-4">
                    <div className="d-flex align-items-center">
                      <div className="post-img-container me-3 flex-shrink-0">
                        <img 
                          src={post.coverImage || "https://via.placeholder.com/80x50"} 
                          alt="" 
                          className="rounded-3 shadow-sm" 
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: "300px" }}>{post.title}</h6>
                        <span className="text-muted x-small d-block mt-1">/{post.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {post.status === "published" ? (
                      <span className="badge-pill bg-success-light text-success">
                        <div className="dot bg-success me-2"></div> Published
                      </span>
                    ) : (
                      <span className="badge-pill bg-warning-light text-warning">
                        <div className="dot bg-warning me-2"></div> Draft
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge-category">
                      <Layers size={12} className="me-1 opacity-50" /> {post.category}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center text-muted small">
                      <Calendar size={14} className="me-2 opacity-50" />
                      {post.createdAt?.seconds ? format(post.createdAt.seconds * 1000, "MMM dd, yyyy") : "Pending"}
                    </div>
                  </td>
                  <td className="pe-4 py-4 text-end">
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm rounded-3 p-2" type="button" data-bs-toggle="dropdown">
                        <MoreVertical size={18} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2">
                        <li>
                          <Link to={`/blog/${post.slug}`} target="_blank" className="dropdown-item rounded-3 d-flex align-items-center py-2">
                            <Eye size={16} className="me-2 text-primary" /> View Live
                          </Link>
                        </li>
                        <li>
                          <Link to={`/admin/edit/${post.id}`} className="dropdown-item rounded-3 d-flex align-items-center py-2">
                            <Edit3 size={16} className="me-2 text-info" /> Edit Post
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider opacity-10" /></li>
                        <li>
                          <button 
                            onClick={() => setDeleteModal({ show: true, post })} 
                            className="dropdown-item rounded-3 d-flex align-items-center py-2 text-danger"
                          >
                            <Trash2 size={16} className="me-2" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="text-muted opacity-25 mb-3"><Search size={48} /></div>
                    <h5 className="text-muted fw-bold">No posts found</h5>
                    <p className="text-muted small">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        show={deleteModal.show} 
        onClose={() => setDeleteModal({ show: false, post: null })}
        title="Confirm Deletion"
        footer={
          <div className="d-flex gap-2">
            <button className="btn btn-light rounded-3" onClick={() => setDeleteModal({ show: false, post: null })}>Cancel</button>
            <button className="btn btn-danger rounded-3" onClick={handleDelete}>Delete Post</button>
          </div>
        }
      >
        <p>Are you sure you want to delete <strong>{deleteModal.post?.title}</strong>? This action is permanent and cannot be undone.</p>
      </Modal>

      <style>{`
        .post-list-page { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .btn-white { background: #fff; color: #64748b; }
        .btn-white:hover { background: #f8f9fa; color: #0f172a; }
        
        .table-light-header { background-color: #f8fafc; }
        .x-small { font-size: 0.7rem; letter-spacing: 0.05em; }
        
        .post-row { transition: background 0.2s; }
        .post-row:hover { background-color: #fcfdfe; }
        
        .post-img-container img { width: 70px; height: 45px; object-fit: cover; }
        
        .badge-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .bg-success-light { background-color: #ecfdf5; }
        .bg-warning-light { background-color: #fffbeb; }
        .dot { width: 6px; height: 6px; border-radius: 50%; }
        
        .badge-category {
          background-color: #f1f5f9;
          color: #475569;
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .search-group .form-control:focus { box-shadow: none; }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default PostList;
