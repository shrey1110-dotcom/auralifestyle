// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAuthToken } from "@/lib/api";

const nav = [
  { to: "", label: "Dashboard" },
  { to: "orders", label: "Orders" },
  { to: "inventory", label: "Inventory" },
  { to: "products", label: "Products" },
  { to: "users", label: "Users & Roles" },
  { to: "settings", label: "Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = getAuthToken();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-72 bg-white border-r min-h-screen py-6 px-4 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-2xl font-bold text-red-600">Aura</div>
          <div className="text-lg font-semibold">Lifestyle</div>
        </div>

        <nav className="space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={`/admin/${n.to}`}
              end={n.to === ""}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8">
          <button
            onClick={() => {
              try {
                localStorage.removeItem("auth_token");
              } catch {}
              navigate("/admin/login");
            }}
            className="mt-4 w-full text-sm px-3 py-2 rounded-md border text-gray-700"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-400">Dev mode: auth bypass enabled.</div>
      </aside>

      <main className="flex-1">
        <div className="border-b bg-white py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden px-3 py-2 border rounded"
              onClick={() => navigate("/admin")}
            >
              ☰
            </button>
            <div className="text-xl font-semibold">Admin</div>
            <div className="text-sm text-gray-500">Auralifestyle</div>
          </div>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search orders, products, customers..."
              className="hidden md:block border rounded px-3 py-2 text-sm w-72"
            />
            <div className="text-sm text-gray-600">Admin</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 grid place-items-center">JS</div>
          </div>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
