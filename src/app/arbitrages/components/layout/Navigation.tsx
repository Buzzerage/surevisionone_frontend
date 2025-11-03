// src/components/layout/Navigation.tsx
"use client";
import React from "react";
import { useLanguage } from "../../../context/LanguageProvider";

const Navigation = () => {
    const { t } = useLanguage();

    return (
        <nav className="main-nav">
            <ul className="nav-list">
                <li className="nav-item">
                    <a href="#" className="nav-link nav-link--active">{t('arbitrage.navigation.opportunities') as string}</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">{t('arbitrage.navigation.history') as string}</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">{t('arbitrage.navigation.settings') as string}</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;