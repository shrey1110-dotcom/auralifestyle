// src/pages/Admin/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api";

/**
 * AdminSettings.jsx
 * - GET  /api/admin/settings
 * - PATCH/POST /api/admin/settings
 *
 * If your backend uses other endpoints, change the URLs accordingly.
 */

async function apiFetch(path, { method = "GET", json } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
    method,
    headers,
    body: json ? JSON.stringify(json) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    let err = `HTTP ${res.status}`;
    try {
      const payload = await res.json();
      err = payload?.message || err;
    } catch {}
    throw new Error(err);
  }
  return res.json();
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTitle: "AuraLifestyle",
    brandName: "AuraLifestyle",
    contactEmail: "",
    contactPhone: "",
    logo: "",
    footerText: "© 2025 AuraLifestyle. All rights reserved.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await apiFetch("/api/admin/settings");
        if (r && typeof r === "object") {
          setSettings((s) => ({ ...s, ...(r.data || r || {}) }));
        }
      } catch {
        // fallback: keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    try {
      setSaving(true);
      setMsg("");
      const payload = settings;
      await apiFetch("/api/admin/settings", { method: "PATCH", json: payload });
      setMsg("Settings saved.");
    } catch (e) {
      setMsg(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Settings</h3>
        <div className="text-sm text-gray-500">Site & brand configuration</div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="bg-white border rounded p-4 max-w-3xl">
          <label className="block mb-2 text-sm">
            Site title
            <input value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <label className="block mb-2 text-sm">
            Brand name
            <input value={settings.brandName} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <label className="block mb-2 text-sm">
            Contact email
            <input value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <label className="block mb-2 text-sm">
            Contact phone
            <input value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <label className="block mb-2 text-sm">
            Logo URL
            <input value={settings.logo} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <label className="block mb-2 text-sm">
            Footer text
            <input value={settings.footerText} onChange={(e) => setSettings({ ...settings, footerText: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </label>

          <div className="flex gap-2 mt-3">
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Reset</button>
            <div className="text-sm text-green-600 ml-4">{msg}</div>
          </div>
        </div>
      )}
    </div>
  );
}
