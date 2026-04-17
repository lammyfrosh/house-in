"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

const ADMIN_CONTACTS = [
  {
    label: "Admin 1",
    whatsapp: "2348075990912",
    phone: "+23408075990912",
    email: "contact@house-in.online",
  },
  {
    label: "Admin 2",
    whatsapp: "2348088769717",
    phone: "+23408088769717",
    email: "support@house-in.online",
  },
];

export default function Footer() {
  const [showWhatsappOptions, setShowWhatsappOptions] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  function buildWhatsappLink(number: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(
      "Hello, I would like to make an enquiry on House-In."
    )}`;
  }

  function buildMailtoLink(email: string) {
    return `mailto:${email}?subject=${encodeURIComponent(
      "House-In Enquiry"
    )}`;
  }

  return (
    <footer className="mt-14 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              House-In
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Find properties for rent, sale and shortlet across selected
              states in Nigeria.
            </p>

            <div className="mt-5 rounded-2xl bg-[#151515] p-4">
              <p className="text-sm leading-6 text-gray-300">
                <span className="font-semibold text-white">Safety Tip:</span>{" "}
                Always inspect properties physically and verify documents
                before payment.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="rounded-xl bg-[#151515] p-2 text-gray-300 transition hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#151515] p-2 text-gray-300 transition hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#151515] p-2 text-gray-300 transition hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#151515] p-2 text-gray-300 transition hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/for-sale"
                  className="text-gray-400 transition hover:text-white"
                >
                  For Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/for-rent"
                  className="text-gray-400 transition hover:text-white"
                >
                  For Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/shortlet"
                  className="text-gray-400 transition hover:text-white"
                >
                  Shortlet
                </Link>
              </li>
              <li>
                <Link
                  href="/requests"
                  className="text-gray-400 transition hover:text-white"
                >
                  Requests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Company
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-gray-400 transition hover:text-white"
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 transition hover:text-white"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Contact
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                Email:{" "}
                <a
                  href={buildMailtoLink("contact@house-in.online")}
                  className="transition hover:text-white hover:underline"
                >
                  contact@house-in.online
                </a>
              </li>
              <li className="leading-6">
                Phone:{" "}
                <a
                  href="tel:+23408075990912"
                  className="transition hover:text-white hover:underline"
                >
                  +23408075990912
                </a>
                <span className="mx-2 text-gray-600">•</span>
                <a
                  href="tel:+23408088769717"
                  className="transition hover:text-white hover:underline"
                >
                  +23408088769717
                </a>
              </li>
              <li>Hours: Mon–Sat, 9am–6pm</li>
            </ul>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/add-property"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  textDecoration: "none",
                }}
              >
                <span style={{ color: "#000000" }}>Add Property</span>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowWhatsappOptions((prev) => !prev);
                    setShowCallOptions(false);
                    setShowEmailOptions(false);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[#151515]"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                  <ChevronDown size={14} />
                </button>

                {showWhatsappOptions && (
                  <div className="mt-2 rounded-2xl border border-gray-800 bg-[#121212] p-2 shadow-xl">
                    {ADMIN_CONTACTS.map((admin) => (
                      <a
                        key={admin.label}
                        href={buildWhatsappLink(admin.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-[#1b1b1b] hover:text-white"
                      >
                        <span>{admin.label}</span>
                        <MessageCircle size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowCallOptions((prev) => !prev);
                    setShowWhatsappOptions(false);
                    setShowEmailOptions(false);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[#151515]"
                >
                  <Phone size={14} />
                  Call
                  <ChevronDown size={14} />
                </button>

                {showCallOptions && (
                  <div className="mt-2 rounded-2xl border border-gray-800 bg-[#121212] p-2 shadow-xl">
                    {ADMIN_CONTACTS.map((admin) => (
                      <a
                        key={admin.label}
                        href={`tel:${admin.phone}`}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-[#1b1b1b] hover:text-white"
                      >
                        <span>{admin.label}</span>
                        <Phone size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailOptions((prev) => !prev);
                    setShowWhatsappOptions(false);
                    setShowCallOptions(false);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[#151515]"
                >
                  <Mail size={14} />
                  Email
                  <ChevronDown size={14} />
                </button>

                {showEmailOptions && (
                  <div className="mt-2 rounded-2xl border border-gray-800 bg-[#121212] p-2 shadow-xl">
                    {ADMIN_CONTACTS.map((admin) => (
                      <a
                        key={admin.label}
                        href={buildMailtoLink(admin.email)}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-[#1b1b1b] hover:text-white"
                      >
                        <span>{admin.label}</span>
                        <Mail size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-800 bg-[#111111] p-4">
          <p className="text-xs leading-6 text-gray-400">
            <span className="font-semibold text-white">Disclaimer:</span> House-In
            is a property discovery and advertising platform. While we strive to
            maintain quality and accurate listings, users are strongly advised to
            independently verify property details, ownership, documentation,
            pricing, and transaction terms before making any payment, commitment,
            or legal decision.
          </p>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} House-In. All rights reserved.</p>
          <p className="text-xs">
            Built for Nigeria • Property approval workflow enabled
          </p>
        </div>
      </div>
    </footer>
  );
}