
import { useState, useEffect } from "react";
import { 
  Edit2,
  Trash2,
  KeyRound,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionModal, setActionModal] = useState({ show: false, user: null, mode: 'edit' });

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch {
      toast.error("Failed to load users.");
    }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const syncAllUsers = async () => {
    toast.info("Users are registered automatically when they sign in. Refreshing list...");
    fetchUsers();
  };

  const handleConfirmAction = async () => {
    const { user, mode, newRole } = actionModal;
    if (!user) return;

    try {
      if (mode === 'edit') {
        await updateDoc(doc(db, "users", user.id), { role: newRole });
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        toast.success("Role updated successfully!");
      } else if (mode === 'delete') {
        await deleteDoc(doc(db, "users", user.id));
        setUsers(prev => prev.filter(u => u.id !== user.id));
        toast.success("User removed!");
      }
      setActionModal({ show: false, user: null, mode: 'edit', newRole: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error("Action failed: " + err.message);
    }
  };

  const handleAction = (user, mode) => {
    setActionModal({ show: true, user, mode, newRole: user.role });
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-page animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">Community</h1>
        <button className="btn btn-outline-primary" onClick={syncAllUsers}><RefreshCw size={16} className="me-2" /> Sync All Users</button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white p-4 border-0">
          <input 
            type="text" 
            className="form-control bg-light border-0 py-2" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">User</th>
                <th>Role</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center">
                      <img src={`https://ui-avatars.com/api/?name=${user.displayName}`} className="rounded-circle me-3" width="40" alt="" />
                      <div><h6 className="mb-0 fw-bold">{user.displayName}</h6><small className="text-muted">{user.email}</small></div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-primary-soft text-primary' : 'bg-light text-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-sm btn-outline-info" onClick={() => handleAction(user, 'edit')}><Edit2 size={16} /></button>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => handleAction(user, 'password')}><KeyRound size={16} /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleAction(user, 'delete')}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        show={actionModal.show} 
        onClose={() => setActionModal({ show: false, user: null })}
        title={actionModal.mode === 'edit' ? 'Edit User Role' : actionModal.mode === 'password' ? 'Reset Password' : 'Remove User'}
        footer={
          <div className="d-flex gap-2 w-100">
            <button className="btn btn-light rounded-3 flex-grow-1" onClick={() => setActionModal({ show: false, user: null })}>Cancel</button>
            <button className="btn btn-primary rounded-3 flex-grow-1" onClick={handleConfirmAction}>Confirm</button>
          </div>
        }
      >
        {actionModal.mode === 'edit' && (
          <select 
            className="form-select" 
            value={actionModal.newRole} 
            onChange={(e) => setActionModal({ ...actionModal, newRole: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {actionModal.mode === 'password' && <p>Send a password reset email to <strong>{actionModal.user?.email}</strong>?</p>}
        {actionModal.mode === 'delete' && <p>Permanently remove <strong>{actionModal.user?.displayName}</strong>?</p>}
      </Modal>

      <style>{`.bg-primary-soft { background: #e0f2fe; }`}</style>
    </div>
  );
};

export default UserList;
