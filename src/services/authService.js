import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth, googleProvider, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const signupWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    
    // Save to Firestore 'users' collection
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      displayName,
      email,
      role: 'user',
      createdAt: new Date()
    });

    return result.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  try {
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const updateUserProfile = async (user, profileData) => {
  try {
    await updateProfile(user, profileData);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const isAdmin = async (user) => {
  if (!user) return false;
  // This will be handled by a more robust lookup in AuthContext
  return false;
};
