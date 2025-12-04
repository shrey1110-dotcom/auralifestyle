// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [defaultAddress, setDefaultAddress] = useState("");

  useEffect(() => {
    setFirst(user?.name?.split?.(" ")?.[0] || "");
    setLast(user?.name?.split?.(" ")?.slice(1).join(" ") || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    alert("Save not implemented. Hook to your update API.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex gap-8">
        <aside className="w-64">
          <div className="bg-neutral-50 p-4 rounded text-sm">
            <div className="font-semibold">{user?.name || "Guest"}</div>
            <div className="text-xs text-neutral-500">{user?.email}</div>
            <div className="mt-3">
              <a className="text-emerald-600 text-sm" href="/membership">Get Membership Now</a>
            </div>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            <button onClick={() => navigate("/orders")} className="w-full text-left p-3 border rounded">Orders <span className="text-neutral-400"> (Track your order here)</span></button>
            <button onClick={() => navigate("/gift-vouchers")} className="w-full text-left p-3 border rounded">Gift Vouchers</button>
            <button onClick={() => navigate("/tss-points")} className="w-full text-left p-3 border rounded">TSS Points <span className="text-neutral-400">(Active TSS Points: 0.00)</span></button>
            <button onClick={() => navigate("/tss-money")} className="w-full text-left p-3 border rounded">TSS Money <span className="text-neutral-400">(Balance: ₹0.00)</span></button>
            <button onClick={() => navigate("/saved-cards")} className="w-full text-left p-3 border rounded">Saved Cards</button>
            <button onClick={() => navigate("/faqs")} className="w-full text-left p-3 border rounded">FAQs</button>
            <button onClick={() => navigate("/profile")} className="w-full text-left p-3 border rounded bg-white text-rose-600">Profile</button>
          </nav>

          <div className="mt-6">
            <button onClick={() => { if (confirm("Delete account?")) alert("Delete endpoint not implemented."); }} className="w-full py-2 border rounded text-red-600">DELETE MY ACCOUNT</button>
            <button onClick={() => { logout?.(); navigate("/"); }} className="w-full mt-3 py-2 border rounded">LOGOUT</button>
          </div>
        </aside>

        <main className="flex-1 bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

          <form onSubmit={onSave} className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-700 mb-2">Email Id</label>
              <input value={email} readOnly className="w-full rounded border bg-neutral-100 px-4 py-2" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">General Information</h4>
                <div className="space-y-3">
                  <label className="block text-xs">First Name *</label>
                  <input value={first} onChange={(e) => setFirst(e.target.value)} className="w-full rounded border px-3 py-2" />

                  <label className="block text-xs mt-2">Last Name</label>
                  <input value={last} onChange={(e) => setLast(e.target.value)} className="w-full rounded border px-3 py-2" />

                  <label className="block text-xs mt-2">Gender</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2"><input type="radio" checked={gender==="male"} onChange={() => setGender("male")} /> Male</label>
                    <label className="flex items-center gap-2"><input type="radio" checked={gender==="female"} onChange={() => setGender("female")} /> Female</label>
                    <label className="flex items-center gap-2"><input type="radio" checked={gender==="other"} onChange={() => setGender("other")} /> Other</label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Contact</h4>
                <div className="space-y-3">
                  <label className="block text-xs">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded border px-3 py-2" />

                  <label className="block text-xs mt-2">Mobile Number *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded border px-3 py-2" />

                  <label className="block text-xs mt-2">Default Address</label>
                  <textarea value={defaultAddress} onChange={(e) => setDefaultAddress(e.target.value)} className="w-full rounded border px-3 py-2 h-24 bg-neutral-50" placeholder="No Address Selected"></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 rounded bg-emerald-700 text-white">SAVE</button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
