// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useTheme } from "@/context/ThemeContext";

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 11v1a7 7 0 0 1-14 0v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20.8 7.3a4.4 4.4 0 0 0-6.2 0L12 9.9l-2.6-2.6a4.4 4.4 0 0 0-6.2 6.2L12 21l8.8-8.8a4.4 4.4 0 0 0 0-6.2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 6h15l-1.6 9.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5 3H3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="20" r="1" fill="currentColor"/>
      <circle cx="18" cy="20" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function IconSunMoon({ dark }) {
  return dark ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4"/></svg>
  );
}

export default function Navbar() {
  const { user, logout, cart, wishlist } = useStore();

  // Defensive: guard if theme context missing
  const themeCtx = useTheme();
  const theme = themeCtx?.theme ?? "light";
  const toggle = themeCtx?.toggle ?? (() => {});

  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    function docClick(e) {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", docClick);
    return () => document.removeEventListener("click", docClick);
  }, []);

  function onSearchSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <button className="p-2 rounded-md hover:bg-neutral-100">
            <IconMenu />
          </button>
          <nav className="flex items-center gap-6">
            <Link to="/men" className="text-sm font-semibold">MEN</Link>
            <Link to="/women" className="text-sm font-semibold">WOMEN</Link>
          </nav>
          <Link to="/" className="text-xl font-extrabold tracking-tight ml-2">
            AURA<span className="font-extrabold">Lifestyle</span>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 ml-auto pr-0">
          <form onSubmit={onSearchSubmit} className="flex items-center bg-white border rounded-full shadow-sm h-11 pr-2 w-[260px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-4 outline-none placeholder:text-neutral-400"
            />
            <div className="text-neutral-500 mr-1">
              <IconMic />
            </div>
            <button type="submit" className="text-neutral-700 hover:text-black">
              <IconSearch />
            </button>
          </form>

          <div className="flex items-center gap-3">
            <button title="Location" className="p-2 rounded-full hover:bg-neutral-100">
              <IconPin />
            </button>
            <button title="Toggle Theme" onClick={toggle} className="p-2 rounded-full hover:bg-neutral-100">
              <IconSunMoon dark={theme === "dark"} />
            </button>

            <div className="relative" ref={ddRef}>
              <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-full hover:bg-neutral-100">
                <IconUser />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <div className="font-medium">{user?.name || "Guest"}</div>
                    <div className="text-sm text-neutral-500">{user?.email || "Not signed in"}</div>
                  </div>
                  <ul className="py-2 text-sm">
                    <li><button onClick={() => { setOpen(false); navigate("/orders"); }} className="w-full text-left px-4 py-2 hover:bg-neutral-50">Orders</button></li>
                    <li><button onClick={() => { setOpen(false); navigate("/profile"); }} className="w-full text-left px-4 py-2 hover:bg-neutral-50">Profile</button></li>
                    <li><button onClick={() => { setOpen(false); logout?.(); }} className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-red-600">Logout</button></li>
                  </ul>
                </div>
              )}
            </div>

            <button title="Wishlist" onClick={() => navigate("/wishlist")} className="p-2 rounded-full hover:bg-neutral-100 relative">
              <IconHeart />
              {Array.isArray(wishlist) && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-rose-600 text-white rounded-full px-1">{wishlist.length}</span>
              )}
            </button>

            <button title="Cart" onClick={() => navigate("/cart")} className="p-2 rounded-full hover:bg-neutral-100 relative">
              <IconCart />
              {Array.isArray(cart) && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-rose-600 text-white rounded-full px-1">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
