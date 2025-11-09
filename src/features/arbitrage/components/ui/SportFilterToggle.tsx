"use client";

// src/components/ui/SportFilterToggle.tsx
import React from "react";
import { MdMenu, MdClose } from "react-icons/md";

import { useAppTranslations } from "@/lib/i18n";

const SportFilterToggle = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  const { sportToggle } = useAppTranslations("arbitrage");

  return (
    <button
      className="sport-filter-toggle"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      aria-controls="sport-sidebar"
      aria-expanded={isSidebarOpen}
      title={sportToggle.title}
    >
      {isSidebarOpen ? <MdClose /> : <MdMenu />}
      <span className="sr-only">
        {isSidebarOpen ? sportToggle.close : sportToggle.open}
      </span>
    </button>
  );
};

export default SportFilterToggle;