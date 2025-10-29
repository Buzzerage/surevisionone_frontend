// src/components/ui/SportFilterToggle.tsx
import React from "react";
import { MdMenu, MdClose } from 'react-icons/md';

const SportFilterToggle = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) => (
    <button
        className="sport-filter-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-controls="sport-sidebar"
        aria-expanded={isSidebarOpen}
        title="Filtrar Deportes"
    >
        {isSidebarOpen ? <MdClose /> : <MdMenu />}
        <span className="sr-only">{isSidebarOpen ? 'Cerrar Filtros' : 'Abrir Filtros'}</span>
    </button>
);

export default SportFilterToggle;