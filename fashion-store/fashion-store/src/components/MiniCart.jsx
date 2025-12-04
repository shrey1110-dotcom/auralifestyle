import React from "react";
import SlideOver from "./SlideOver";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function MiniCart() {
  const { showMiniCart, closeMiniCart, cart, subtotal, removeFromCart } = useStore();
  const nav = useNavigate();

  return (
    <SlideOver open={showMiniCart} onClose={closeMiniCart} title="My Bag">
      {(cart?.length ?? 0) === 0 ? (
        <div className="text-sm opacity-70">Your cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((it, i) => (
              <li key={`${it.id}-${i}`} className="flex gap-3 items-center">
                <img src={it.image} alt={it.title} className="w-14 h-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-1">{it.title}</div>
                  <div className="text-sm opacity-70">
                    {it.size && <>Size {it.size} · </>}
                    {it.color && <>Color {it.color} · </>}
                    Qty {it.qty}
                  </div>
                </div>
                <div className="text-sm font-semibold">₹{(it.price || 0) * (it.qty || 1)}</div>
                <button onClick={() => removeFromCart(it.id, it)} className="text-xs ml-2 rounded px-2 py-1 hover:bg-black/5">
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-4 flex items-center justify-between">
            <div className="font-medium">Subtotal</div>
            <div className="font-semibold">₹{subtotal}</div>
          </div>

          <button
            className="mt-4 w-full rounded-xl bg-black text-white py-2.5 hover:shadow-lg"
            onClick={() => { closeMiniCart(); nav("/cart"); }}
          >
            Go to Cart
          </button>
        </>
      )}
    </SlideOver>
  );
}
