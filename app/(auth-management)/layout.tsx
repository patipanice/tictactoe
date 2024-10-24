"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { CircularProgress } from "@nextui-org/progress";
import { useRouter } from "next/navigation";
export default function AuthManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return <CircularProgress aria-label="Loading..." />;
  }

  if (!loading && user) {
    router.push("/tictactoe");
    return;
  } 

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block w-full max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
