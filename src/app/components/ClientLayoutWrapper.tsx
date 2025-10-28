"use client";

import { usePathname } from "next/navigation";
import HeaderPublic from "./HeaderPublic";
import HeaderPrivate from "../arbitrages/components/layout/HeaderPrivate";
import { useSupabaseSession } from "../hooks/useSupabaseSession";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, loading } = useSupabaseSession();

  const isPrivate = pathname.startsWith("/arbitrages") || pathname.startsWith("/profile");

  return (
    <>
      {!loading && (isPrivate ? <HeaderPrivate session={session} /> : <HeaderPublic session={session} />)}
      <main className="pt-0">{children}</main>
    </>
  );
}
