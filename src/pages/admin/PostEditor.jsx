
import { useState, useEffect, useCallback, useRef } from "react";
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
import { Link as LinkIcon, Zap } from "lucide-react";

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
  const [isImporting, setIsImporting] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");

  const isMounted = useRef(true);

  const fetchPost = useCallback(async (postId) => {
    try {
      setFetching(true);
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && isMounted.current) {
        const data = docSnap.data();
        setFormData({
          ...initialFormData,
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          content: data.content || "",
          status: data.status || "draft"
        });
        setImagePreview(data.coverImage || "");
      } else if (isMounted.current) {
        toast.error("Post not found");
        navigate("/admin/posts");
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post.");
      }
    } finally {
      if (isMounted.current) setFetching(false);
    }
  }, [navigate]);

  useEffect(() => {
    isMounted.current = true;
    if (id) {
      fetchPost(id);
    } else {
      setFormData(initialFormData);
      setImagePreview("");
      setFetching(false);
    }
    return () => { isMounted.current = false; };
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

  const handleLinkImport = async () => {
    const url = prompt("Enter article URL to import:");
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      return toast.error("Please enter a valid URL");
    }

    setIsImporting(true);
    const importToast = toast.loading("Magic at work... Extracting content");

    try {
      // Using Microlink API with 'prerender' and 'data' flags for better extraction
      const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&prerender=true&palette=true&meta=true`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.status === "success") {
        const { title, description, image, logo, publisher } = result.data;
        
        // We attempt to construct a clean HTML body from description and title
        // Note: Full HTML extraction usually requires a paid Microlink plan or a custom proxy.
        // For this "Genius" version, we use the available metadata to build a rich preview.
        const importedTitle = title || "";
        const importedContent = `
          <p><em>Originally published at ${publisher || url}</em></p>
          <p>${description || ""}</p>
          <p>Imported via Magic Link. Please review and expand this content.</p>
        `;

        setFormData(prev => ({
          ...prev,
          title: importedTitle,
          slug: slugify(importedTitle),
          content: importedContent,
          coverImage: image?.url || logo?.url || "",
          tags: publisher ? publisher.toLowerCase() : ""
        }));

        if (image?.url || logo?.url) {
          setImagePreview(image?.url || logo?.url);
        }

        toast.success("Article metadata imported!", { id: importToast });
      } else {
        throw new Error("Failed to extract data");
      }
    } catch (error) {
      console.error("Import Error:", error);
      toast.error("Could not import article. Try another link.", { id: importToast });
    } finally {
      setIsImporting(false);
    }
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

      // Ensure we have a slug
      const finalSlug = formData.slug?.trim() || slugify(formData.title || "untitled");

      const postData = {
        ...formData,
        slug: finalSlug,
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">{id ? "Edit Article" : "New Article"}</h4>
          <p className="text-muted small mb-0">Craft your masterpiece or import from the web</p>
        </div>
        <div className="d-flex gap-2">
          {!id && (
            <button 
              onClick={handleLinkImport} 
              disabled={isImporting}
              className="btn btn-outline-primary px-3 rounded-3 shadow-sm d-flex align-items-center"
            >
              {isImporting ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <Zap size={16} className="me-2" />
              )}
              Magic Import
            </button>
          )}
          <button onClick={handleSubmit} className="btn btn-primary px-4 rounded-3 shadow-sm d-flex align-items-center">
            {id ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <input 
              type="text" name="title" className="h1 border-0 w-100 mb-3" 
              placeholder="Article Title" value={formData.title} onChange={handleChange} 
              style={{ outline: 'none', fontWeight: '800' }}
            />
            <div className="quill-wrapper">
              <ReactQuill 
                theme="snow" 
                modules={modules}
                value={formData.content} 
                onChange={handleContentChange} 
                placeholder="Write your story here..." 
              />
            </div>
          </div>
        </div>


        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <h6 className="fw-bold mb-3 text-primary d-flex align-items-center">
              <LinkIcon size={18} className="me-2" />
              Metadata
            </h6>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Cover Image URL</label>
              <input type="text" name="coverImage" className="form-control" placeholder="https://..." value={formData.coverImage} onChange={handleImageURLChange} />
              {imagePreview && (
                <div className="position-relative mt-2">
                  <img src={imagePreview} className="img-fluid rounded-3 shadow-sm" alt="Preview" />
                  <div className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75">Preview</div>
                </div>
              )}
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
              <label className="form-label small fw-bold text-muted">Tags (comma separated)</label>
              <input type="text" name="tags" className="form-control" placeholder="react, news, ai" value={formData.tags} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          
          <div className="alert alert-info border-0 rounded-4 small">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Pro Tip:</strong> Use the <strong>Magic Import</strong> button to quickly start a post from an existing article.
          </div>
        </div>
      </div>
      <style>{`
        .quill-wrapper .ql-container { min-height: 400px; font-size: 1.15rem; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
        .quill-wrapper .ql-toolbar { border-top-left-radius: 12px; border-top-right-radius: 12px; }
        .form-control, .form-select { border-radius: 10px; padding: 0.6rem 1rem; border: 1px solid #eee; }
        .form-control:focus, .form-select:focus { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.05); border-color: #0d6efd; }
      `}</style>
    </div>
  );
};

export default PostEditor;

