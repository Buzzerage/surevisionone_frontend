// src/components/ui/NewBadge.tsx
import React from "react";

const NewBadge = ({ label }: { label: string }) => (
  <span className="new-badge">✨ {label}</span>
);

export default NewBadge;