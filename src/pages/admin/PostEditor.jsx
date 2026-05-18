import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { 
  createPost, 
  updatePost
} from "../../services/blogService";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { uploadImage, deleteImage } from "../../services/storageService";
import { slugify } from "../../utils/helpers";
import { 
  Save, 
  X, 
  Upload, 
  Type, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Tag,
  FolderOpen
} from "lucide-react";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category: "tech",
    tags: "",
    coverImage: "",
    coverImagePath: "",
    metaDescription: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          ...data,
          tags: data.tags?.join(", ") || ""
        });
        setImagePreview(data.coverImage);
      } else {
        alert("Post not found");
        navigate("/admin/posts");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setFetching(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const init = async () => {
      if (id) {
        await fetchPost();
      }
    };
    init();
  }, [id, fetchPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "title" && !id) {
      setFormData(prev => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImage = formData.coverImage;
      let coverImagePath = formData.coverImagePath;

      // Upload new image if selected
      if (imageFile) {
        // Delete old image if it exists
        if (coverImagePath) {
          try { await deleteImage(coverImagePath); } catch (err) { console.warn("Failed to delete old image", err); }
        }
        const uploadResult = await uploadImage(imageFile);
        coverImage = uploadResult.url;
        coverImagePath = uploadResult.path;
      }

      const postData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        coverImage,
        coverImagePath
      };

      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }

      navigate("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">{id ? "Edit Post" : "Create New Post"}</h2>
          <p className="text-muted small mb-0">Fill in the details below to {id ? "update" : "publish"} your post.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate("/admin/posts")} className="btn btn-light rounded-3 px-4">
            <X size={18} className="me-2" /> Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="btn btn-primary rounded-3 px-4 shadow-sm"
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
            {id ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Title</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Type size={18} className="text-muted" /></span>
                <input 
                  type="text" 
                  name="title" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="Enter a catchy title..." 
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Slug (URL)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><LinkIcon size={18} className="text-muted" /></span>
                <input 
                  type="text" 
                  name="slug" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="post-url-slug" 
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Content</label>
              <div style={{ height: "400px", marginBottom: "50px" }}>
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleContentChange}
                  style={{ height: "350px" }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['link', 'image', 'code-block'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-4">Organization & SEO</h6>
            
            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Category</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><FolderOpen size={18} className="text-muted" /></span>
                <select 
                  name="category" 
                  className="form-select bg-light border-0" 
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="tech">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="business">Business</option>
                  <option value="travel">Travel</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Tags (comma separated)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Tag size={18} className="text-muted" /></span>
                <input 
                  type="text" 
                  name="tags" 
                  className="form-control bg-light border-0" 
                  placeholder="react, webdev, tutorial" 
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label fw-bold small text-uppercase tracking-wider">Meta Description</label>
              <textarea 
                name="metaDescription" 
                className="form-control bg-light border-0" 
                rows="4" 
                placeholder="Brief summary for search engines..."
                value={formData.metaDescription}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-4">Cover Image</h6>
            <div className="text-center">
              {imagePreview ? (
                <div className="position-relative mb-3">
                  <img src={imagePreview} alt="Preview" className="img-fluid rounded-3 shadow-sm" style={{ maxHeight: "200px" }} />
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow"
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="border border-2 border-dashed rounded-4 py-5 mb-3 bg-light cursor-pointer hover-bg-white transition"
                  onClick={() => document.getElementById("coverImage").click()}
                >
                  <ImageIcon size={40} className="text-muted mb-2 opacity-50" />
                  <p className="text-muted small mb-0">Click to upload cover image</p>
                </div>
              )}
              <input 
                type="file" 
                id="coverImage" 
                className="d-none" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm rounded-pill px-4"
                onClick={() => document.getElementById("coverImage").click()}
              >
                <Upload size={14} className="me-2" /> {imagePreview ? "Change Image" : "Upload Image"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .hover-bg-white:hover { background-color: #fff !important; }
        .tracking-wider { letter-spacing: 0.05em; }
        .ql-container { border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
        .ql-toolbar { border-top-left-radius: 12px; border-top-right-radius: 12px; border-color: #f8f9fa !important; background-color: #f8f9fa; }
        .ql-container { border-color: #f8f9fa !important; }
      `}</style>
    </div>
  );
};

export default PostEditor;
