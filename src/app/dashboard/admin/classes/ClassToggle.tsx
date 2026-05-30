"use client";

import { useState } from "react";
import { toggleClassStatus } from "./actions";

export default function ClassToggle({ classId, initialStatus, isSmall }: { classId: string, initialStatus: boolean, isSmall?: boolean }) {
  const [active, setActive] = useState(initialStatus);

  const handleToggle = async () => {
    const nextStatus = !active;
    setActive(nextStatus);
    await toggleClassStatus(classId, nextStatus);
  };

  return (
    <button 
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        active ? 'bg-green-500' : 'bg-slate-300'
      } ${isSmall ? 'scale-75' : ''}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        active ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}