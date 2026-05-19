import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const SETTINGS_COLLECTION = "settings";
const SITE_SETTINGS_DOC = "site";

export const getSiteSettings = async () => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return { footerScrollingText: "Welcome to ModernBlog - Stay updated with the latest in tech and lifestyle!" };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return { footerScrollingText: "Welcome to ModernBlog!" };
  }
};

export const updateSiteSettings = async (settings) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw error;
  }
};
