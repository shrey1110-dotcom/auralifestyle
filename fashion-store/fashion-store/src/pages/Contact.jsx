import React from "react";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p className="mt-2 text-sm opacity-70">We’re here to help.</p>

      <div className="mt-6 text-sm leading-6 space-y-4">
        <p>
          <strong>AuraLifestyle</strong> is a fast fashion brand with <strong>modest design</strong>.
          For any questions on orders, sizing, shipping or collaborations, reach out:
        </p>

        <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
          <div><span className="font-medium">Phone:</span> <a className="underline" href="tel:+919650306378">+91 96503 06378</a></div>
          <div><span className="font-medium">Email:</span> <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a></div>
          <div className="mt-2 text-xs opacity-70">
            Mon–Sat, 10:00–18:00 IST (excl. public holidays)
          </div>
        </div>

        {/* Simple contact form (optional, non-breaking) */}
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! We’ll get back to you shortly.");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="rounded border px-3 py-2 bg-transparent" placeholder="Full name" required />
            <input className="rounded border px-3 py-2 bg-transparent" placeholder="Email" type="email" required />
          </div>
          <input className="w-full rounded border px-3 py-2 bg-transparent" placeholder="Subject" />
          <textarea className="w-full rounded border px-3 py-2 bg-transparent min-h-[120px]" placeholder="Message" />
          <button className="h-11 px-5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
