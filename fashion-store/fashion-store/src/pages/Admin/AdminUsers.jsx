// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api";

/**
 * AdminUsers.jsx
 * - Lists users
 * - Promote / demote (role changes)
 * - Delete user
 *
 * Note: expects backend admin endpoints:
 *  GET   /api/admin/users         -> { items: [...] } or array
 *  PATCH /api/admin/users/:id     -> update role
 *  DELETE /api/admin/users/:id
 *
 * If your backend uses other paths, update the URLs below.
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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setErr("");
    try {
      let r;
      try {
        r = await apiFetch("/api/admin/users");
      } catch (e) {
        // fallback sample if no endpoint
        r = {
          items: [
            { _id: "1", name: "Sarthak", email: "ss9650306378@gmail.com", role: "admin", userId: "USR_ABC" },
            { _id: "2", name: "Riddhi", email: "riddhi@example.com", role: "user", userId: "USR_DEF" },
          ],
        };
      }
      const list = Array.isArray(r) ? r : r.items || r.users || [];
      setUsers(list);
    } catch (e) {
      setErr(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(u, newRole) {
    setOpLoading(true);
    setErr("");
    try {
      await apiFetch(`/api/admin/users/${encodeURIComponent(u._id)}`, {
        method: "PATCH",
        json: { role: newRole },
      });
      await fetchUsers();
    } catch (e) {
      setErr(e.message || "Failed to update role");
    } finally {
      setOpLoading(false);
    }
  }

  async function deleteUser(u) {
    if (!confirm(`Delete user ${u.email}? This is irreversible.`)) return;
    setOpLoading(true);
    setErr("");
    try {
      await apiFetch(`/api/admin/users/${encodeURIComponent(u._id)}`, { method: "DELETE" });
      await fetchUsers();
    } catch (e) {
      setErr(e.message || "Failed to delete user");
    } finally {
      setOpLoading(false);
    }
  }

  const filtered = users.filter((u) =>
    `${u.name || ""} ${u.email || ""} ${u.userId || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Users & Roles</h3>
        <div className="flex gap-2">
          <input
            placeholder="Search users..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />
          <button onClick={fetchUsers} className="px-3 py-1 border rounded text-sm">Refresh</button>
        </div>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      <div className="bg-white border rounded overflow-hidden">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-gray-500">No users found.</div>
        ) : (
          filtered.map((u) => (
            <div key={u._id} className="p-3 flex items-center justify-between border-b last:border-b-0">
              <div>
                <div className="font-medium">{u.name || "—"}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
                <div className="text-xs text-gray-400">UserId: {u.userId || "-"}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded border text-sm">{u.role || "user"}</div>

                {u.role !== "admin" ? (
                  <button
                    onClick={() => changeRole(u, "admin")}
                    disabled={opLoading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Promote
                  </button>
                ) : (
                  <button
                    onClick={() => changeRole(u, "user")}
                    disabled={opLoading}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
                  >
                    Demote
                  </button>
                )}

                <button
                  onClick={() => deleteUser(u)}
                  disabled={opLoading}
                  className="px-3 py-1 border rounded text-sm text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
