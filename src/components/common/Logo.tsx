"use client";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      className="font-bold text-xl tracking-tight text-[var(--color-accent-primary)] cursor-pointer select-none"
    >
      SureVisionOne
    </div>
  );
}