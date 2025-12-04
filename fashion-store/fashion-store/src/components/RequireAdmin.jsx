// src/components/RequireAdmin.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "@/lib/api";

/**
 * RequireAdmin
 *
 * DEV BEHAVIOR: If running in dev mode (Vite: import.meta.env.DEV === true),
 * this component will bypass the auth requirement and render children so you
 * can develop the Admin UI. It also shows a clear DEV banner.
 *
 * PRODUCTION BEHAVIOR: in production it requires an auth token (basic check).
 * You can extend it to verify role with /api/auth/me if desired.
 *
 * NOTE: This is a temporary developer helper. Remove or tighten checks before deploying.
 */

export default function RequireAdmin({ children }) {
  const isDev = Boolean(import.meta.env?.DEV);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    if (isDev) {
      // In dev, allow instantly
      setOk(true);
      return;
    }
    // In production: simple token existence check. You can extend to call /api/auth/me.
    const token = getAuthToken();
    setOk(Boolean(token));
  }, [isDev]);

  if (ok === null) return null; // or a spinner

  if (isDev) {
    // Render the DEV banner + admin UI
    return (
      <>
        <div style={{ background: "#fff7e6", borderBottom: "1px solid #ffd59e", padding: 8, textAlign: "center" }}>
          <strong style={{ color: "#b45309" }}>DEV MODE</strong> — Authentication bypassed. Admin pages are open for local development only.
        </div>
        {children}
      </>
    );
  }

  if (!ok) {
    // No token -> redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
