import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import AuthModal from "./AuthModal"; // keep your path
import { useStore } from "../context/StoreContext";
import { Sun, Moon } from "lucide-react";

/**
 * Props:
 * - anchorRef: ref to the button that opens this menu (the username button)
 * - onClose: () => void
 */
export default function ProfileMenu({ anchorRef, onClose }) {
  const { user, logout, theme, toggleTheme } = useStore();
  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  // ---- placement below the username button
  const panelRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const PANEL_W = 320;
  const GAP = 8;

  useLayoutEffect(() => {
    const place = () => {
      const r = anchorRef?.current?.getBoundingClientRect?.();
      if (!r) return;
      let left = r.left; // align left edges to sit "just below" the name
      // keep within viewport
      left = Math.min(
        Math.max(left, 8),
        window.innerWidth - PANEL_W - 8
      );
      let top = r.bottom + GAP;
      setCoords({ top, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchorRef]);

  // ---- click outside to close
  useEffect(() => {
    const onDocDown = (e) => {
      const inPanel = panelRef.current?.contains(e.target);
      const inAnchor = anchorRef?.current?.contains?.(e.target);
      if (!inPanel && !inAnchor) onClose?.();
    };
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [onClose, anchorRef]);

  // ---- menu body
  const menu = (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      {/* the panel itself */}
      <div
        ref={panelRef}
        className="fixed pointer-events-auto w-[320px] rounded-xl border bg-white shadow-xl"
        style={{ top: coords.top, left: coords.left }}
      >
        <div className="p-4 border-b">
          {user ? (
            <div>
              <div className="text-xs text-black/60 mb-1">Signed in as</div>
              <div className="font-semibold leading-tight">
                {user.name || "Customer"}
              </div>
              {user.email ? (
                <div className="text-sm text-black/60 truncate">{user.email}</div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-black/70">
              Welcome to <b>AuraLifestyle</b>
            </div>
          )}
        </div>

        <div className="p-2 grid">
          <Link
            to="/profile"
            onClick={onClose}
            className="px-3 py-2 rounded hover:bg-black/5"
          >
            Profile
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="px-3 py-2 rounded hover:bg-black/5"
          >
            Orders
          </Link>
          <Link
            to="/favourites"
            onClick={onClose}
            className="px-3 py-2 rounded hover:bg-black/5"
          >
            Favourites
          </Link>
          <Link
            to="/payments"
            onClick={onClose}
            className="px-3 py-2 rounded hover:bg-black/5"
          >
            Payments
          </Link>
          <Link
            to="/addresses"
            onClick={onClose}
            className="px-3 py-2 rounded hover:bg-black/5"
          >
            Addresses
          </Link>

          <button
            className="px-3 py-2 rounded text-left hover:bg-black/5 flex items-center justify-between"
            onClick={toggleTheme}
          >
            <span>Theme</span>
            <span className="inline-flex items-center gap-2 text-black/70">
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
        </div>

        <div className="p-3 border-t">
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose?.();
              }}
              className="w-full px-3 py-2 rounded bg-black text-white text-sm"
            >
              Logout
            </button>
          ) : (
            <div className="flex w-full gap-2">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setOpenAuth(true);
                }}
                className="flex-1 px-3 py-2 rounded border text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setOpenAuth(true);
                }}
                className="flex-1 px-3 py-2 rounded bg-black text-white text-sm"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal (portal inside) */}
      <AuthModal
        open={openAuth}
        mode={authMode}
        onClose={() => setOpenAuth(false)}
      />
    </div>
  );

  return createPortal(menu, document.body);
}
