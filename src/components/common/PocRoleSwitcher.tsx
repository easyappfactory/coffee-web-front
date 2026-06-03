"use client";

import { useEffect, useState } from "react";
import { POC_USERS } from "@/lib/api";

const ROLES = Object.keys(POC_USERS) as (keyof typeof POC_USERS)[];

export function PocRoleSwitcher() {
  const [role, setRole] = useState<string>("USER");

  useEffect(() => {
    const stored = localStorage.getItem("pocUserId");
    const found = Object.entries(POC_USERS).find(([, v]) => v === stored);
    if (found) setRole(found[0]);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value;
    setRole(selected);
    localStorage.setItem("pocUserId", POC_USERS[selected]);
    window.location.reload();
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        background: "#1a1a2e",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ fontWeight: 600 }}>POC</span>
      <select
        value={role}
        onChange={handleChange}
        style={{
          background: "#16213e",
          color: "#fff",
          border: "1px solid #0f3460",
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
