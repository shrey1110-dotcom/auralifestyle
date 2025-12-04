// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand / Social */}
          <div>
            <div className="text-3xl font-extrabold tracking-tight mb-4">
              <span className="text-gray-900 dark:text-white">Aura</span>
              <span className="text-emerald-600 dark:text-emerald-400">Lifestyle</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
              Culture in every thread. Designed in India. Loved everywhere.
            </p>
            <div className="mt-4 flex items-center gap-3 text-neutral-500">
              <a
                href="https://instagram.com/aura.lifestyle.official"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/919650306378"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400"
                aria-label="WhatsApp"
              >
                Whatsapp
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/men" className="hover:text-emerald-600 dark:hover:text-emerald-400">Men</Link></li>
              <li><Link to="/women" className="hover:text-emerald-600 dark:hover:text-emerald-400">Women</Link></li>
              <li><Link to="/collections/new" className="hover:text-emerald-600 dark:hover:text-emerald-400">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Trending */}
          <div>
            <h4 className="font-semibold mb-3">Trending</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/collections/oversized" className="hover:text-emerald-600 dark:hover:text-emerald-400">Oversized Tees</Link></li>
              <li><Link to="/collections/bestsellers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Bestsellers</Link></li>
              <li><Link to="/collections/merch" className="hover:text-emerald-600 dark:hover:text-emerald-400">Official Merch</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400">FAQs</Link></li>
              <li><Link to="/help/shipping" className="hover:text-emerald-600 dark:hover:text-emerald-400">Shipping Policy</Link></li>
              <li><Link to="/help/track" className="hover:text-emerald-600 dark:hover:text-emerald-400">Track Order</Link></li>
              <li><Link to="/company/careers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Careers</Link></li>
              <li><Link to="/company/about" className="hover:text-emerald-600 dark:hover:text-emerald-400">About Us</Link></li>

              {/* Contact Us: link only (no extra text under it) */}
              <li>
                <Link to="/help/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Contact Us
                </Link>
              </li>

              <li><Link className="hover:underline" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:underline" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:underline" to="/returns">Return & Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter stripe */}
        <div className="mt-12 rounded-xl border border-black/5 dark:border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h5 className="font-semibold">We’ve got you covered.</h5>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Be the first to know about new drops & exclusive deals.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full sm:w-72 rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2">
              Join
            </button>
          </form>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} AuraLifestyle. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400">Terms</Link>
            <Link to="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400">Privacy</Link>
            <Link to="/help/shipping" className="hover:text-emerald-600 dark:hover:text-emerald-400">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}