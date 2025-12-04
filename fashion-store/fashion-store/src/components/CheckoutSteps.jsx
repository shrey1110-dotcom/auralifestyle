// src/components/CheckoutSteps.jsx
import React from "react";

/**
 * Centered stepper for the checkout flow.
 * Usage:
 *   <CheckoutSteps current="bag" />
 *   <CheckoutSteps current="address" />
 *   <CheckoutSteps current="payment" />
 */
export default function CheckoutSteps({ current = "bag", className = "" }) {
  const stepClass = (k) =>
    `tracking-wide ${
      current === k ? "font-semibold text-neutral-900" : "text-neutral-600"
    }`;
  const Sep = () => <span className="mx-3 md:mx-4 text-neutral-500">—</span>;

  return (
    <div className={`w-full py-3 md:py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm md:text-base text-center select-none">
          <span className={stepClass("bag")}>BAG</span>
          <Sep />
          <span className={stepClass("address")}>ADDRESS</span>
          <Sep />
          <span className={stepClass("payment")}>PAYMENT</span>
        </div>
      </div>
    </div>
  );
}
