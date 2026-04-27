"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "https://www.instagram.com/houseinpropertyhub/",
  twitter: "https://x.com/houseinproperty",
  tiktok: "https://www.tiktok.com/@houseinpropertyhub?lang=en",
};

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
    return `mailto:${email}?subject=${encodeURIComponent("House-In Enquiry")}`;
  }

  return (
    <footer className="mt-14 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* BRAND */}
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
                Always inspect properties physically and verify documents before
                payment.
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="mt-5 flex items-center gap-3">
              <a href={SOCIAL_LINKS.facebook} className="rounded-xl bg-[#151515] p-2 text-gray-300 hover:text-white" target="_blank">
                <Facebook size={18} />
              </a>

              <a href={SOCIAL_LINKS.instagram} className="rounded-xl bg-[#151515] p-2 text-gray-300 hover:text-white" target="_blank">
                <Instagram size={18} />
              </a>

              {/* X (Twitter) */}
              <a href={SOCIAL_LINKS.twitter} className="rounded-xl bg-[#151515] p-2 text-gray-300 hover:text-white" target="_blank">
                <FaXTwitter size={18} />
              </a>

              <a href={SOCIAL_LINKS.tiktok} className="rounded-xl bg-[#151515] p-2 text-gray-300 hover:text-white" target="_blank">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Explore</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/for-sale">For Sale</Link></li>
              <li><Link href="/for-rent">For Rent</Link></li>
              <li><Link href="/shortlet">Shortlet</Link></li>
              <li><Link href="/requests">Requests</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/safety">Safety Tips</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Contact</p>

            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                Email:{" "}
                <a href={buildMailtoLink("contact@house-in.online")} className="hover:underline">
                  contact@house-in.online
                </a>
              </li>

              <li>
                Phone:{" "}
                <a href="tel:+23408075990912">+23408075990912</a> •{" "}
                <a href="tel:+23408088769717">+23408088769717</a>
              </li>

              <li>Hours: Mon–Sat, 9am–6pm</li>
            </ul>

            {/* QUICK ACTIONS */}
            <div className="mt-5 flex flex-col gap-3">
             <Link
  href="/add-property"
  className="bg-white !text-black rounded-xl px-4 py-2 text-center font-bold hover:bg-gray-200 transition"
>
  Add Property
</Link>

              {/* WhatsApp */}
              <button onClick={() => setShowWhatsappOptions(!showWhatsappOptions)} className="border px-4 py-2 rounded-xl text-xs">
                WhatsApp
              </button>
              {showWhatsappOptions &&
                ADMIN_CONTACTS.map((a) => (
                  <a key={a.label} href={buildWhatsappLink(a.whatsapp)} target="_blank">
                    {a.label}
                  </a>
                ))}

              {/* Call */}
              <button onClick={() => setShowCallOptions(!showCallOptions)} className="border px-4 py-2 rounded-xl text-xs">
                Call
              </button>
              {showCallOptions &&
                ADMIN_CONTACTS.map((a) => (
                  <a key={a.label} href={`tel:${a.phone}`}>
                    {a.label}
                  </a>
                ))}

              {/* Email */}
              <button onClick={() => setShowEmailOptions(!showEmailOptions)} className="border px-4 py-2 rounded-xl text-xs">
                Email
              </button>
              {showEmailOptions &&
                ADMIN_CONTACTS.map((a) => (
                  <a key={a.label} href={buildMailtoLink(a.email)}>
                    {a.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* FOOT NOTE */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} House-In. All rights reserved.
        </div>
      </div>
    </footer>
  );
}