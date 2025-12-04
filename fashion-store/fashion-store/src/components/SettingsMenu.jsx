import React from "react";
import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";

export default function SettingsMenu({ inline = false }) {
  const { theme, toggleTheme } = useStore();

  const Section = ({ children }) => (
    <div className={inline ? "" : "p-3 border-t"}>{children}</div>
  );

  return (
    <div className={inline ? "grid gap-2" : "rounded-xl border bg-white"}>
      <Section>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full text-left px-3 py-2 rounded hover:bg-black/5"
        >
          Theme: <b>{theme === "dark" ? "Dark" : "Light"}</b>
        </button>
        <Link to="/faq" className="block px-3 py-2 rounded hover:bg-black/5">
          FAQ
        </Link>
        <Link to="/support" className="block px-3 py-2 rounded hover:bg-black/5">
          Customer Support
        </Link>
        <Link to="/policies" className="block px-3 py-2 rounded hover:bg-black/5">
          Privacy & Policies
        </Link>
      </Section>
    </div>
  );
}
