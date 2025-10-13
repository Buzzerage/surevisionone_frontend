// src/components/layout/Navigation.tsx
import React from "react";

const Navigation = () => (
    <nav className="main-nav">
        <ul className="nav-list">
            <li className="nav-item">
                <a href="#" className="nav-link nav-link--active">Oportunidades</a>
            </li>
            <li className="nav-item">
                <a href="#" className="nav-link">Historial</a>
            </li>
            <li className="nav-item">
                <a href="#" className="nav-link">Configuración</a>
            </li>
        </ul>
    </nav>
);

export default Navigation;