"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1.5" title="Switch colour theme">
      <ThemeDot
        color="#6366f1"
        label="Indigo"
        active={theme === "indigo"}
        onClick={() => setTheme("indigo")}
      />
      <ThemeDot
        color="#3f8c6f"
        label="Classic green"
        active={theme === "original"}
        onClick={() => setTheme("original")}
      />
    </div>
  );
}

function ThemeDot({ color, label, active, onClick }: {
  color: string; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={`Switch to ${label} theme`}
      className="w-3.5 h-3.5 rounded-full transition-all duration-200"
      style={{
        background: color,
        boxShadow: active
          ? `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px ${color}`
          : "none",
        opacity: active ? 1 : 0.45,
        transform: active ? "scale(1.15)" : "scale(1)",
      }}
    />
  );
}
