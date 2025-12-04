// src/components/KebabMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";

function useOutsideClose(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);
  return ref;
}

function getTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
}
function setTheme(next) {
  if (typeof window === "undefined") return;
  localStorage.setItem("theme", next);
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function KebabMenu() {
  const { logout, user } = useStore();
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    setTheme(theme); // sync html class from initial
    // eslint-disable-next-line
  }, []);

  const ref = useOutsideClose(open, () => setOpen(false));

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="menu"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
        title="Menu"
      >
        <span className="block h-1 w-1 rounded-full bg-current" />
        <span className="block h-1 w-1 rounded-full bg-current mx-1" />
        <span className="block h-1 w-1 rounded-full bg-current" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden z-40"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="text-xs uppercase opacity-60">Signed in</div>
            <div className="font-semibold truncate">
              {user?.name || user?.email || "Guest"}
            </div>
          </div>

          <button
            className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => (window.location.href = "/profile")}
          >
            Your Profile
          </button>
          <button
            className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => (window.location.href = "/orders")}
          >
            Your Orders
          </button>

          <button
            className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={toggleTheme}
          >
            Theme: <span className="font-medium ml-1">{theme === "dark" ? "Black" : "White"}</span>
          </button>

          <button
            className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => (window.location.href = "/settings")}
          >
            Settings
          </button>

          <button
            className="w-full text-left px-4 py-3 text-rose-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => {
              logout?.();
              setOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
