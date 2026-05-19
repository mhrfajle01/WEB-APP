import { useState, useEffect } from "react";
import { subscribeToAuthChanges } from "../services/authService";
import { AuthContext } from "./AuthContextInstance";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserRole = async (firebaseUser) => {
    if (!firebaseUser) return false;
    
    // Check environment variable for admin email
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'mhfajle136@gmail.com';
    if (firebaseUser.email === adminEmail) {
      console.log("User identified as admin via email:", firebaseUser.email);
      return true;
    }

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const isUserAdmin = userData.role === 'admin';
        if (isUserAdmin) console.log("User identified as admin via Firestore role.");
        return isUserAdmin;
      }
      return false;
    } catch (error) {
      console.error("Error fetching user role from Firestore:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      console.log("Auth state changed:", currentUser ? currentUser.email : "No user");
      setUser(currentUser);
      if (currentUser) {
        const isUserAdmin = await fetchUserRole(currentUser);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
