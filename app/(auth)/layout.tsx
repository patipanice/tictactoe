"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { CircularProgress } from "@nextui-org/progress";
import { useRouter } from "next/navigation";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return <CircularProgress aria-label="Loading..."/>;
  }

  if (!loading && !user) {
    router.push("/signin");
    return;
  }

  return (
    <section>
      <div className="py-2">{children}</div>
    </section>
  );
}
