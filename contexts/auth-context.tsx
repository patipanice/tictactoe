"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  score: number;
  playerWinStack: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  onChangeUser: (user: FirebaseUser | null) => void;
  onChangeScore: (score: number) => void;
  onChangePlayerWinStack: (playerWinStack: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [playerWinStack, setPlayerWinStack] = useState<number>(0); // Track player's win stack
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onChangeUser = (user: FirebaseUser | null) => {
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      alert(String(error?.message));
      console.error("Login failed:", error.message);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      router.push("/signin");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      alert(String(error?.message));
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      console.error("Signup failed:", error.message);
    }
  };

  const onChangeScore = (_score: number) => {
    setScore(_score)
  }

  const onChangePlayerWinStack = (stack: number) => {
    setPlayerWinStack(stack)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, score,playerWinStack, onChangeScore, login, logout, signup, onChangeUser, onChangePlayerWinStack }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
