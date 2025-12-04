// src/components/AuthModal.jsx
import React, { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, Mail, UserRound, Phone, ShieldCheck } from "lucide-react";

export default function AuthModal({ open, onClose, brand = "Aura Lifestyle" }) {
  const { loginRequestOtp, loginVerifyOtp, user } = useStore();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [step, setStep] = useState("email"); // "email" | "code"

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // NEW
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sentTo, setSentTo] = useState("");

  // Auto-close after successful auth
  useEffect(() => {
    if (open && user) onClose?.();
  }, [open, user, onClose]);

  // Reset form on open/close
  useEffect(() => {
    if (!open) {
      setMode("login");
      setStep("email");
      setEmail("");
      setName("");
      setPhone("");
      setCode("");
      setErr("");
      setSentTo("");
      setLoading(false);
    }
  }, [open]);

  // Close with ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const phoneOk = /^\d{10}$/.test(phone);
  const canSend =
    mode === "signup"
      ? !!email.trim() && !!name.trim() && phoneOk
      : !!email.trim(); // login: only email required

  const sendOtp = async () => {
    setErr("");
    setLoading(true);
    try {
      // store phone locally if you want to use it later after verify
      if (phoneOk) {
        try {
          localStorage.setItem("pending_phone", phone.trim());
        } catch {}
      }
      await loginRequestOtp(email.trim(), name.trim()); // API as-is
      setStep("code");
      setSentTo(email.trim());
    } catch (e) {
      setErr(e?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setErr("");
    setLoading(true);
    try {
      await loginVerifyOtp(email.trim(), code.trim());
      // Optionally merge phone into stored user after verify:
      if (phoneOk) {
        try {
          const u = JSON.parse(localStorage.getItem("user") || "null");
          if (u && !u.phone) {
            const merged = { ...u, phone: phone.trim() };
            localStorage.setItem("user", JSON.stringify(merged));
          }
        } catch {}
      }
      // It will close via the effect when user is set
    } catch (e) {
      setErr(e?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" onClick={onClose} />

      {/* Slide-over */}
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] md:w-[480px] bg-white dark:bg-neutral-900 shadow-2xl transform transition-transform duration-300 ease-out translate-x-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/70 dark:border-neutral-800">
          <div className="font-semibold text-lg">Account</div>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 overflow-y-auto">
          <div
            className="mx-auto w-full rounded-[28px] px-5 py-6 sm:px-6 sm:py-8 shadow-lg border
                       border-neutral-200/70 dark:border-neutral-800
                       bg-[radial-gradient(120%_120%_at_0%_0%,#f7efe3,transparent),radial-gradient(120%_120%_at_100%_0%,#fff6ea,transparent)] dark:bg-[linear-gradient(180deg,#111,#0c0c0c)]"
          >
            <h3 className="text-center text-2xl font-serif font-semibold mb-6">{brand}</h3>

            {/* STEP: email */}
            {step === "email" && (
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium">Email / Username</div>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 px-3">
                    <Mail size={16} className="opacity-60" />
                    <input
                      className="h-11 flex-1 bg-transparent outline-none"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputMode="email"
                    />
                  </div>
                </label>

                {/* Ask for Name and Phone in BOTH modes (required for signup) */}
                <label className="block">
                  <div className="text-sm font-medium">Full Name {mode === "signup" && <span className="text-rose-600">*</span>}</div>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 px-3">
                    <UserRound size={16} className="opacity-60" />
                    <input
                      className="h-11 flex-1 bg-transparent outline-none"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="text-sm font-medium">
                    Phone Number {mode === "signup" && <span className="text-rose-600">*</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 px-3">
                    <Phone size={16} className="opacity-60" />
                    <input
                      className="h-11 flex-1 bg-transparent outline-none"
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </div>
                  {mode === "signup" && phone && !phoneOk && (
                    <div className="text-xs text-rose-600 mt-1">Enter a valid 10-digit number.</div>
                  )}
                </label>

                <div className="text-right text-sm">
                  <button
                    type="button"
                    onClick={() => window.open("/privacy", "_self")}
                    className="underline opacity-80 hover:opacity-100"
                  >
                    Privacy & security
                  </button>
                </div>

                {err && <div className="text-sm text-rose-600">{err}</div>}

                <button
                  disabled={loading || !canSend}
                  onClick={sendOtp}
                  className="mt-2 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold disabled:opacity-50
                             dark:bg-white dark:text-neutral-900"
                >
                  {loading ? "Sending…" : mode === "signup" ? "CREATE ACCOUNT" : "LOGIN"}
                </button>

                <div className="text-center mt-2">
                  {mode === "signup" ? (
                    <button
                      className="underline text-sm"
                      onClick={() => { setMode("login"); setErr(""); }}
                      disabled={loading}
                    >
                      LOG IN
                    </button>
                  ) : (
                    <button
                      className="underline text-sm"
                      onClick={() => { setMode("signup"); setErr(""); }}
                      disabled={loading}
                    >
                      SIGN UP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP: code */}
            {step === "code" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <ShieldCheck size={16} />
                  We sent a one-time code to <span className="font-medium">{sentTo || email}</span>
                </div>

                <input
                  className="w-full text-center text-lg tracking-[0.35em] h-12 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="— — — —"
                  inputMode="numeric"
                />

                {err && <div className="text-sm text-rose-600">{err}</div>}

                <button
                  disabled={loading || code.length < 4}
                  onClick={verifyOtp}
                  className="h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold disabled:opacity-50
                             dark:bg-white dark:text-neutral-900"
                >
                  {loading ? "Verifying…" : "VERIFY & CONTINUE"}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    disabled={loading}
                    onClick={() => { setStep("email"); setCode(""); setErr(""); }}
                    className="underline opacity-80 hover:opacity-100"
                  >
                    Change details
                  </button>
                  <button
                    disabled={loading}
                    onClick={sendOtp}
                    className="underline opacity-80 hover:opacity-100"
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-5 pb-5 text-xs opacity-70">
          By continuing you agree to our{" "}
          <a href="/terms" className="underline">Terms</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </div>
      </aside>
    </div>
  );
}
