"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import HeaderPublic from "./HeaderPublic";
import HeaderPrivate from "./HeaderPrivate";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

type ClientLayoutWrapperProps = {
  children: ReactNode;
};

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
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
