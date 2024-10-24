import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Utility function to get a collection reference
export const getCollectionRef = (
  collectionName: string,
  pathSegments?: any
) => {
  if (pathSegments) {
    return collection(db, collectionName, pathSegments);
  }
  return collection(db, collectionName);
};

// Utility function to fetch documents with optional filters
export const fetchDocuments = async (
  collectionName: string,
  filters: { field: string; operator: any; value: any }[] = []
) => {
  try {
    let q = query(getCollectionRef(collectionName));

    filters.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching documents: ", error);
    throw new Error("Failed to fetch documents.");
  }
};
