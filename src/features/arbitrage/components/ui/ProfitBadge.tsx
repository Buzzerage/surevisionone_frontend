// src/components/ui/ProfitBadge.tsx
import React from "react";

const ProfitBadge = ({ profit }: { profit: number }) => {
    const base = "profit-badge";
    if (profit >= 1) return <span className={`${base} profit-high`}>+{profit.toFixed(2)}%</span>;
    if (profit >= 0.5) return <span className={`${base} profit-medium`}>+{profit.toFixed(2)}%</span>;
    return <span className={`${base} profit-low`}>+{profit.toFixed(2)}%</span>;
};

export default ProfitBadge;