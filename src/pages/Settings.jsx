import { useState, useEffect } from "react";
import { changeUserPassword, updateUserProfile } from "../services/authService";
import { getSiteSettings, updateSiteSettings } from "../services/settingsService";
import { useAuth } from "../hooks/useAuth";
import { Lock, Mail, User as UserIcon, Save, Key, Camera, Link as LinkIcon, Globe, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [siteLoading, setSiteLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || ""
  });

  const [siteSettings, setSiteSettings] = useState({
    footerScrollingText: ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      });
    }

    const fetchSiteSettings = async () => {
      if (isAdmin) {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      }
    };
    fetchSiteSettings();
  }, [user, isAdmin]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateUserProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSiteUpdate = async (e) => {
    e.preventDefault();
    setSiteLoading(true);
    try {
      await updateSiteSettings(siteSettings);
      toast.success("Site settings updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update site settings.");
      console.error(error);
    } finally {
      setSiteLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }
    if (passwords.new.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    setLoading(true);
    try {
      await changeUserPassword(passwords.current, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-4 pb-5">
      <div className="mb-5 text-center">
        <h2 className="fw-bold mb-1 display-font">Settings</h2>
        <p className="text-muted small mb-0">Manage your profile, security, and site configuration.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Profile Info */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary-subtle p-3 rounded-4">
                <UserIcon size={24} className="text-primary" />
              </div>
              <h5 className="fw-bold mb-0">Profile</h5>
            </div>

            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img 
                  src={profileData.photoURL || "https://via.placeholder.com/120"} 
                  alt="Profile" 
                  className="rounded-circle shadow-sm object-fit-cover border border-4 border-white" 
                  width="100" 
                  height="100"
                />
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow-sm">
                  <Camera size={14} />
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Avatar URL</label>
                <input 
                  type="url" 
                  className="form-control bg-light border-0 py-2" 
                  value={profileData.photoURL}
                  onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 rounded-pill fw-bold transition"
                disabled={profileLoading}
              >
                {profileLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
                Save Profile
              </button>
            </form>
          </div>
        </div>

        {/* Site Settings (Admin Only) */}
        {isAdmin && (
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-info-subtle p-3 rounded-4">
                  <Globe size={24} className="text-info" />
                </div>
                <h5 className="fw-bold mb-0">Site Settings</h5>
              </div>

              <form onSubmit={handleSiteUpdate}>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Footer Scrolling Text</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><MessageSquare size={18} className="text-muted" /></span>
                    <textarea 
                      className="form-control bg-light border-0 py-2" 
                      rows="4"
                      value={siteSettings.footerScrollingText}
                      onChange={(e) => setSiteSettings({...siteSettings, footerScrollingText: e.target.value})}
                      placeholder="Enter announcement text..."
                    ></textarea>
                  </div>
                  <div className="form-text small opacity-75">This text will appear as a marquee in the footer.</div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-info text-white w-100 rounded-pill fw-bold transition"
                  disabled={siteLoading}
                >
                  {siteLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
                  Update Site Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-warning-subtle p-3 rounded-4">
                <Key size={24} className="text-warning" />
              </div>
              <h5 className="fw-bold mb-0">Security</h5>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  className="form-control bg-light border-0 py-2" 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-control bg-light border-0 py-2" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-dark w-100 rounded-pill fw-bold transition"
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .bg-primary-subtle { background-color: rgba(13, 110, 253, 0.1); }
        .bg-info-subtle { background-color: rgba(13, 202, 240, 0.1); }
        .bg-warning-subtle { background-color: rgba(255, 193, 7, 0.1); }
        .transition { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default Settings;
