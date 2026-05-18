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
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.role === 'admin';
      }
      return false;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
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
