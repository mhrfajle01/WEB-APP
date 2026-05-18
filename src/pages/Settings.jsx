import { useState, useEffect } from "react";
import { changeUserPassword, updateUserProfile } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { Lock, Mail, User as UserIcon, Save, Key, Camera, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateUserProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      toast.success("Profile updated successfully!");
      // We don't need to manually update state here as AuthContext listens to changes
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setProfileLoading(false);
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
        <h2 className="fw-bold mb-1 display-font">Account Settings</h2>
        <p className="text-muted small mb-0">Manage your public profile and security preferences.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Profile Info */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary-subtle p-3 rounded-4">
                <UserIcon size={24} className="text-primary" />
              </div>
              <h5 className="fw-bold mb-0">Your Profile</h5>
            </div>

            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img 
                  src={profileData.photoURL || "https://via.placeholder.com/120"} 
                  alt="Profile" 
                  className="rounded-circle shadow-sm object-fit-cover border border-4 border-white" 
                  width="120" 
                  height="120"
                />
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow-sm">
                  <Camera size={16} />
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><UserIcon size={18} className="text-muted" /></span>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Avatar URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><LinkIcon size={18} className="text-muted" /></span>
                  <input 
                    type="url" 
                    className="form-control bg-light border-0 py-2" 
                    value={profileData.photoURL}
                    onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                  <input type="email" className="form-control bg-light border-0 py-2" value={user?.email || ""} disabled />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center transition"
                disabled={profileLoading}
              >
                {profileLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Security / Password Change */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-warning-subtle p-3 rounded-4">
                <Key size={24} className="text-warning" />
              </div>
              <h5 className="fw-bold mb-0">Security & Password</h5>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Current Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Lock size={18} className="text-muted" /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="••••••••" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Lock size={18} className="text-muted" /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="••••••••" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Lock size={18} className="text-muted" /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="••••••••" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center transition"
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <Save size={18} className="me-2" />}
                Save New Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .bg-primary-subtle { background-color: rgba(13, 110, 253, 0.1); }
        .bg-warning-subtle { background-color: rgba(255, 193, 7, 0.1); }
        .tracking-wider { letter-spacing: 0.05em; }
        .transition { transition: all 0.3s ease; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </div>
  );
};

export default Settings;
