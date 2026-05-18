
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { 
  createPost, 
  updatePost
} from "../../services/blogService";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { slugify } from "../../utils/helpers";
import toast from "react-hot-toast";

const initialFormData = {
  title: "",
  slug: "",
  content: "",
  category: "tech",
  tags: "",
  coverImage: "",
  status: "draft"
};

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");


  const fetchPost = useCallback(async (postId) => {
    let isMounted = true;
    try {
      setFetching(true);
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && isMounted) {
        const data = docSnap.data();
        setFormData({
          ...initialFormData,
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          content: data.content || "",
          status: data.status || "draft"
        });
        setImagePreview(data.coverImage || "");
      } else if (isMounted) {
        toast.error("Post not found");
        navigate("/admin/posts");
      }
    } catch (error) {
      if (error.name !== 'AbortError' && isMounted) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post.");
      }
    } finally {
      if (isMounted) setFetching(false);
    }
    return () => { isMounted = false; };
  }, [navigate]);

  useEffect(() => {
    let cleanup;
    if (id) {
      cleanup = fetchPost(id); // eslint-disable-line react-hooks/set-state-in-effect
    } else {
      setFormData(initialFormData);
      setImagePreview("");
      setFetching(false);
    }
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, [id, fetchPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !id) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content: content || "" }));
  };

  const handleImageURLChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, coverImage: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.title?.trim() || !formData.content?.trim()) {
      return toast.error("Title and content are required!");
    }
    
    const loadingToast = toast.loading(id ? "Updating post..." : "Publishing post...");

    try {
      const tagsArray = String(formData.tags || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      const postData = {
        ...formData,
        tags: tagsArray,
        updatedAt: new Date()
      };

      if (id) {
        await updatePost(id, postData);
        toast.success("Post updated successfully!", { id: loadingToast });
      } else {
        await createPost(postData);
        toast.success("Post published successfully!", { id: loadingToast });
      }

      navigate("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error saving post: " + (error.message || "Unknown error"), { id: loadingToast });
    }
  };

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">{id ? "Edit Article" : "New Article"}</h4>
        <button onClick={handleSubmit} className="btn btn-primary px-4 rounded-3 shadow-sm">
          {id ? "Update" : "Publish"}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <input 
              type="text" name="title" className="h1 border-0 w-100 mb-3" 
              placeholder="Article Title" value={formData.title} onChange={handleChange} 
            />
            <div className="quill-wrapper">
              <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} placeholder="Write your story here..." />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <h6 className="fw-bold mb-3 text-primary">Metadata</h6>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Cover Image URL</label>
              <input type="text" name="coverImage" className="form-control" placeholder="https://..." value={formData.coverImage} onChange={handleImageURLChange} />
              {imagePreview && <img src={imagePreview} className="img-fluid mt-2 rounded-3" alt="Preview" />}
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                <option value="tech">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <style>{`.quill-wrapper .ql-container { min-height: 300px; font-size: 1.1rem; }`}</style>
    </div>
  );
};

export default PostEditor;
