import React from "react";

export default function SlideOver({ open, onClose, title, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-[60] ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-[380px] max-w-[92vw] bg-white dark:bg-neutral-900 shadow-2xl z-[61]
                    transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button className="rounded px-2 py-1 hover:bg-black/5" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{children}</div>
      </aside>
    </>
  );
}
