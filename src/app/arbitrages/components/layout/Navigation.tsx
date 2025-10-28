"use client";
// src/components/layout/Navigation.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    href: string;
};

const NAV_ITEMS: NavItem[] = [
    { label: "Oportunidades", href: "/arbitrages" },
    { label: "Historial", href: "#" },
    { label: "Configuración", href: "/profile" },
];

const Navigation = () => {
    const pathname = usePathname();

    return (
        <nav className="main-nav">
            <ul className="nav-list">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href !== "#" && pathname.startsWith(item.href);
                    return (
                        <li key={item.label} className="nav-item">
                            {item.href === "#" ? (
                                <span className="nav-link">{item.label}</span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`nav-link ${isActive ? "nav-link--active" : ""}`.trim()}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navigation;