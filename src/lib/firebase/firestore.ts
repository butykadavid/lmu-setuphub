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
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

/**
 * Add a new document to a collection
 */
export const addDocument = async (
  collectionName: string,
  data: DocumentData
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 */
export const getDocuments = async (
  collectionName: string
): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a single document by ID
 */
export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(
      `Error getting document ${docId} from ${collectionName}:`,
      error
    );
    throw error;
  }
};

/**
 * Query documents in a collection
 */
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(
      `Error updating document ${docId} in ${collectionName}:`,
      error
    );
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(
      `Error deleting document ${docId} from ${collectionName}:`,
      error
    );
    throw error;
  }
};
