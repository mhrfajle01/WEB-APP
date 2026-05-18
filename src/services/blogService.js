import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const COLLECTION_NAME = "posts";

export const createPost = async (postData) => {
  if (!postData.title || !postData.content) {
    throw new Error("Title and content are required to create a post.");
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...postData,
      likes: postData.likes || [],
      likeCount: postData.likeCount || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Firestore Error [${COLLECTION_NAME}]:`, error.code, error.message, error);
    throw error;
  }
};

export const getPosts = async (category = null, limitCount = 50, includeDrafts = false) => {
  try {
    const postsCol = collection(db, COLLECTION_NAME);
    let q;

    if (category) {
      q = query(postsCol, where("category", "==", category), limit(100));
    } else {
      q = query(postsCol, orderBy("createdAt", "desc"), limit(100));
    }
    
    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt || { seconds: Date.now() / 1000 }
      };
    });

    if (!includeDrafts) {
      posts = posts.filter(p => p.status === "published");
    }

    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    posts.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

    return posts.slice(0, limitCount);

  } catch (error) {
    if (error.name === 'AbortError') return [];
    
    console.error("Data fetch failed:", error.code, error.message);
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      let allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (!includeDrafts) allPosts = allPosts.filter(p => p.status === "published");
      if (category) allPosts = allPosts.filter(p => p.category === category);
      
      return allPosts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, limitCount);
    } catch (fallbackError) {
      if (fallbackError.name === 'AbortError') return [];
      throw error;
    }
  }
};

export const likePost = async (postId, userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const likes = data.likes || [];
      if (!likes.includes(userId)) {
        await updateDoc(docRef, {
          likes: [...likes, userId],
          likeCount: (data.likeCount || 0) + 1
        });
      }
    }
  } catch (error) {
    console.error("Firestore operation failed:", error.code, error.message, error);
    throw error;
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const likes = data.likes || [];
      if (likes.includes(userId)) {
        await updateDoc(docRef, {
          likes: likes.filter(id => id !== userId),
          likeCount: Math.max(0, (data.likeCount || 0) - 1)
        });
      }
    }
  } catch (error) {
    console.error("Firestore operation failed:", error.code, error.message, error);
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
    console.error("Firestore operation failed:", error.code, error.message, error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  if (!id) throw new Error("Post ID is required for update.");
  
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Firestore operation failed:", error.code, error.message, error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Firestore operation failed:", error.code, error.message, error);
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
    console.error("Firestore operation failed:", error.code, error.message, error);
    throw error;
  }
};
