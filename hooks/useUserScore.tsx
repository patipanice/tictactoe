"use client";
import { useCallback, useMemo } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collectionName, db } from "@/config/firebase";

const useUserScore = (
  userId: string | undefined,
  email: string | undefined,
  defaultScore = 0
) => {
  const userDocRef = useMemo(
    () => doc(db, collectionName.users, userId ?? ""),
    [userId]
  );

  const fetchScore = useCallback(async () => {
    if (!userId) return { score: 0, winStack: 0 };
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { score: defaultScore, winStack: 0, email });
    }
    return userDoc.data() ?? { score: 0, winStack: 0, email };
  }, [userDocRef]);

  const updateScore = useCallback(
    async (score: number, winStack: number) => {
      await updateDoc(userDocRef, { score, winStack });
    },
    [userDocRef]
  );

  return { fetchScore, updateScore };
};

export default useUserScore;
