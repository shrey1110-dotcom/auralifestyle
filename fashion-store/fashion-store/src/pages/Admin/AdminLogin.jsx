// src/pages/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { authApi, setAuthToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // optional; some flows save it when creating user
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(""); // for dev-mode visibility when backend returns devOtp
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function sendOtp() {
    setMsg("");
    if (!email) {
      setMsg("Enter email first.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.requestOtp(email, name);
      // backend may return a devOtp in dev mode; show it if present
      if (res?.devOtp) setDevOtp(String(res.devOtp));
      setOtpSent(true);
      setMsg("OTP sent — check email (or use dev OTP shown).");
    } catch (e) {
      setMsg(e?.payload?.message || e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setMsg("");
    if (!otp || !email) {
      setMsg("Enter both email and OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp, name });
      // Backend should return { token, user }
      const token = res?.token || res?.data?.token;
      if (token) {
        // set token both in localStorage and in-memory helper so adminApi uses it immediately
        try {
          setAuthToken(token);
        } catch {
          // fallback to localStorage if setAuthToken isn't available
          localStorage.setItem("auth_token", token);
        }
      }

      // Optionally validate role returned by backend
      const role = res?.user?.role || (res?.data && res.data.user && res.data.user.role);
      if (role && role !== "admin") {
        setMsg("Logged in but account is not an admin.");
        // still redirect if you want, but typically we stop here:
        // navigate("/"); // or keep on admin login page
        setLoading(false);
        return;
      }

      // Successful admin login — redirect to admin dashboard
      navigate("/admin");
    } catch (e) {
      setMsg(e?.payload?.message || e.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>

        {!otpSent ? (
          <>
            <label className="block mb-2 text-sm">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="admin@example.com"
              />
            </label>

            {/* optional name field used only when creating new users */}
            <label className="block mb-3 text-sm">
              Name (optional)
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="Your name"
              />
            </label>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-3 text-sm">
              OTP sent to <span className="font-medium">{email}</span>. Enter it below.
            </div>

            <label className="block mb-3 text-sm">
              OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="123456"
                maxLength={8}
              />
            </label>

            {devOtp && (
              <div className="mb-3 text-xs text-gray-600">
                (dev OTP: <span className="font-semibold">{devOtp}</span>)
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={verify}
                disabled={loading}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                {loading ? "Verifying..." : "Verify & Sign in"}
              </button>
              <button
                onClick={() => {
                  // allow re-sending OTP
                  setOtp("");
                  setDevOtp("");
                  setOtpSent(false);
                  setMsg("");
                }}
                className="px-4 py-2 border rounded"
              >
                Edit email
              </button>
            </div>
          </>
        )}

        {msg && <div className="mt-3 text-sm text-center text-red-600">{msg}</div>}

        <div className="mt-4 text-xs text-center text-gray-500">
          Note: this site uses OTP login. No password required.
        </div>
      </div>
    </div>
  );
}
