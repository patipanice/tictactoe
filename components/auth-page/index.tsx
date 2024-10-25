"use client";

import React, { useEffect, useState } from "react";
import AuthForm from "../form/auth-form";
import { useFormik } from "formik";
import { useAuthContext } from "@/contexts/auth-context";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
  signInWithPopup,
} from "firebase/auth";
import { auth, collectionName, db, googleProvider } from "@/config/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AuthFormValue } from "@/types/auth";
import { useRouter } from "next/navigation";
import { AuthMode } from "@/enums/auth.enum";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { GoogleIcon } from "../icons/GoogleIcon";

const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

const createNewUserEmailAndPasswordFirebaseAuth = async (
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) {
      await saveNewUserToFireStoreCollection(res.user);
      return { status: 200 };
    }
  } catch (err: any) {
    console.error(err);
    alert(String(err?.message));
  }
};

const saveNewUserToFireStoreCollection = async (user: User) => {
  const docRef = doc(db, collectionName.users, user.uid);
  await setDoc(docRef, {
    id: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    creationTime: user.metadata.creationTime,
    createdAt: serverTimestamp(),
    score: 0,
    winStack: 0
  });
};

interface AuthPageProps {
  authMode: AuthMode;
}

const AuthPage: React.FC<AuthPageProps> = ({ authMode }) => {
  const { login } = useAuthContext();
  const router = useRouter();
  const [savedPassword, setSavedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const password = localStorage.getItem("savedPassword");
      setSavedPassword(String(password));
    }
  }, []);

  const formik = useFormik<AuthFormValue>({
    initialValues: {
      email: "",
      password:
        authMode === AuthMode.SIGN_IN && savedPassword ? savedPassword : "",
      isSavePassword: true,
      code: "",
    },
    async onSubmit(values) {
      const { email, password, isSavePassword } = values;

      if (authMode === AuthMode.SIGN_IN) {
        if (isSavePassword) {
          localStorage.setItem("savedPassword", password);
        }
        login(email, password);
      } else if (authMode === AuthMode.SIGN_UP) {
        await createNewUserEmailAndPasswordFirebaseAuth(email, password).then(
          (res) => {
            if (res?.status === 200) {
              router.push("/tictactoe");
            }
          }
        );
      } else if (authMode === AuthMode.RESET_PASSWORD) {
        await resetPassword(email).then((res) => {
          confirm("ได้ส่งอีเมลไปเพื่อรีเซ็ทรหัสผ่านแล้ว เช็คอีเมล!");
          router.push("/signin");
        });
      }
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(String(error))
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <div className="space-y-5">
      <AuthForm formik={formik} authMode={authMode} />
      <Divider />
      <Button
        onClick={handleGoogleSignIn}
        size="md"
        fullWidth
        startContent={<GoogleIcon />}
        className="bg-white border border-gray-400 dark:text-black"
      >
        Login with Google
      </Button>
    </div>
  );
};

export default AuthPage;
