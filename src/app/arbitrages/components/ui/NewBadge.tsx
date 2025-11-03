// src/components/ui/NewBadge.tsx
"use client";
import React from "react";
import { useLanguage } from "../../../context/LanguageProvider";

const NewBadge = () => {
    const { t } = useLanguage();
    return <span className="new-badge">✨ {t('arbitrage.badges.new') as string}</span>;
};

export default NewBadge;