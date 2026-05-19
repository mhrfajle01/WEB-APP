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
  limit,
  arrayUnion,
  arrayRemove,
  increment,
  startAfter,
  Timestamp
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
      likes: [],
      likeCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Firestore Error [${COLLECTION_NAME}]:`, error.code, error.message, error);
    throw error;
  }
};

export const getPosts = async (category = null, limitCount = 10, lastVisible = null, includeDrafts = true) => {
  try {
    const postsCol = collection(db, COLLECTION_NAME);
    let q;

    // Base constraints: order by createdAt descending
    let constraints = [orderBy("createdAt", "desc"), limit(limitCount)];

    // If we only want published posts, add that filter
    if (!includeDrafts) {
      constraints.push(where("status", "==", "published"));
    }

    // If category is specified, add that filter
    if (category) {
      constraints.push(where("category", "==", category));
    }

    // Pagination
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    try {
      q = query(postsCol, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date())
        };
      });

      return {
        posts,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
    } catch (queryError) {
      console.warn("Primary query failed, falling back to simplified fetch:", queryError.message);
      
      // Fallback: Fetch everything and filter in memory if the primary query fails (likely index issue)
      const fallbackSnapshot = await getDocs(collection(db, COLLECTION_NAME));
      let allPosts = fallbackSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date())
        };
      });

      // Filter by drafts
      if (!includeDrafts) {
        allPosts = allPosts.filter(p => p.status === "published");
      }

      // Filter by category
      if (category) {
        allPosts = allPosts.filter(p => p.category === category);
      }

      // Sort manually
      allPosts.sort((a, b) => {
        const dateA = a.createdAt?.getTime ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt?.getTime ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });

      return {
        posts: allPosts.slice(0, limitCount),
        lastVisible: null
      };
    }
  } catch (error) {
    console.error("Critical failure in getPosts:", error);
    return { posts: [], lastVisible: null };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(docRef, {
      likes: arrayUnion(userId),
      likeCount: increment(1)
    });
  } catch (error) {
    console.error("Firestore operation failed:", error.code, error.message, error);
    throw error;
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(docRef, {
      likes: arrayRemove(userId),
      likeCount: increment(-1)
    });
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
