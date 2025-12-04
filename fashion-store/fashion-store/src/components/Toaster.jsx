import React from "react";
import { useToast } from "../context/ToastContext";
import { ShoppingCart, Heart, Check } from "lucide-react";

const iconByType = {
  cart: ShoppingCart,
  wish: Heart,
  success: Check,
  info: Check,
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const Icon = iconByType[t.type] || iconByType.info;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-4 py-3 shadow-xl ring-1 ring-black/5 animate-[slideIn_.25s_ease]"
            onClick={() => dismiss(t.id)}
            role="status"
          >
            <div className={`mt-0.5 rounded-full p-2 ${t.type === "wish" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"}`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="font-medium leading-tight">{t.title}</div>
              {t.message ? <div className="text-sm opacity-80">{t.message}</div> : null}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-8px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
