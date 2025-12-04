import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to the very top whenever the route changes. */
export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If you're navigating to an in-page anchor like /men#size-chart, don't override it
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, search, hash, behavior]);

  return null;
}
