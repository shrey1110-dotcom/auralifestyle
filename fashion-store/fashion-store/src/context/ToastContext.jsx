// src/context/ToastContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const noop = () => {};
const DEFAULT = { show: noop };
const ToastContext = createContext(DEFAULT);

export function useToast() {
  return useContext(ToastContext) ?? DEFAULT;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((a, b = {}) => {
    // Supports:
    //   show("Added to bag", { type: "cart", subtitle: "Street Joggers" })
    //   show({ title: "Added to wishlist", subtitle: "Rory Top", type: "wish" })
    let payload;
    if (typeof a === "string") {
      let title = a;
      let subtitle = b.subtitle || "";
      if (!subtitle && title.includes("—")) {
        const parts = title.split("—");
        title = parts[0].trim();
        subtitle = parts.slice(1).join("—").trim();
      }
      payload = {
        title,
        subtitle,
        type: b.type || "info",
        timeout: Number.isFinite(b.timeout) ? b.timeout : 2500,
      };
    } else if (a && typeof a === "object") {
      payload = {
        title: a.title || a.message || "",
        subtitle: a.subtitle || "",
        type: a.type || "info",
        timeout: Number.isFinite(a.timeout) ? a.timeout : 2500,
      };
    } else {
      return;
    }

    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      Math.random().toString(36).slice(2);

    const toast = { id, ...payload, createdAt: Date.now() };
    setToasts((q) => [...q, toast]);
    setTimeout(() => {
      setToasts((q) => q.filter((t) => t.id !== id));
    }, toast.timeout);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Top-right stack */}
      <div className="fixed top-5 right-5 z-[10000] pointer-events-none space-y-3">
        {toasts.map((t) => {
          const sty =
            t.type === "cart"
              ? { chip: "bg-emerald-100 text-emerald-700", card: "border-emerald-100/60" }
              : t.type === "wish"
              ? { chip: "bg-rose-100 text-rose-700", card: "border-rose-100/60" }
              : t.type === "success"
              ? { chip: "bg-emerald-100 text-emerald-700", card: "border-emerald-100/60" }
              : t.type === "warning"
              ? { chip: "bg-amber-100 text-amber-700", card: "border-amber-100/60" }
              : t.type === "error"
              ? { chip: "bg-rose-100 text-rose-700", card: "border-rose-100/60" }
              : { chip: "bg-zinc-100 text-zinc-700", card: "border-zinc-100/60" };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto min-w-[260px] max-w-[340px] rounded-2xl bg-white shadow-lg border ${sty.card} px-3 py-2 flex items-start gap-3`}
            >
              <div className={`h-9 w-9 rounded-full grid place-items-center ${sty.chip}`}>
                {t.type === "wish" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-6.716-4.35-9.428-7.06A6 6 0 1 1 12 6.586 6 6 0 1 1 21.428 13.94C18.716 16.65 12 21 12 21z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 20h9v-2h-8.42a.25.25 0 0 1-.22-.37L11.1 15h6.45a2 2 0 0 0 1.8-1.1l3.58-7.2A1 1 0 0 0 22 5H6.21L5.27 3.55A1 1 0 0 0 4.41 3H2v2h2l3 6" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] leading-5 text-black">{t.title}</div>
                {t.subtitle ? (
                  <div className="text-sm leading-5 text-zinc-700 truncate">{t.subtitle}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
