"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthSession from "../hooks/useAuthSession";
import ProfilePanel from "./ProfilePanel";

const ProfilePage = () => {
  const router = useRouter();
  const { user, loading } = useAuthSession();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background-primary)] text-[var(--color-text-accent)]">
        Verificando tu sesión...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfilePanel user={user} />;
};

export default ProfilePage;