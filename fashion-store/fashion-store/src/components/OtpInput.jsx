import { useEffect, useRef } from "react";

/** 6-digit OTP input with auto-advance/backspace */
export default function OtpInput({ value = "", onChange, length = 6, disabled = false }) {
  const inputs = Array.from({ length });
  const refs = useRef([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, length);
  }, [length]);

  const handleChange = (i, v) => {
    const d = (v || "").replace(/\D/g, "").slice(-1); // last digit
    const arr = value.split("");
    arr[i] = d || "";
    const newVal = arr.join("").slice(0, length);
    onChange(newVal);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      e.preventDefault();
      const arr = value.split("");
      arr[i - 1] = "";
      onChange(arr.join(""));
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {inputs.map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-12 w-10 text-center border rounded-md text-lg font-semibold focus:ring-2 focus:ring-orange-500"
          disabled={disabled}
        />
      ))}
    </div>
  );
}
