import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const COLLECTION_NAME = "posts";

export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async (category = null, limitCount = 10) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME), 
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    if (category) {
      q = query(
        collection(db, COLLECTION_NAME), 
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error getting post by slug:", error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const searchPosts = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search directly.
    // For a production app, we'd use Algolia or ElasticSearch.
    // Here we'll do a simple filter on the client side or a prefix search if possible.
    // For simplicity, we fetch all and filter, or just fetch latest.
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};
