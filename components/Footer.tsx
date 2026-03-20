import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
} from "lucide-react";

const ADMIN_WHATSAPP_NUMBER = "+23408075990912";

export default function Footer() {
  const whatsappHref = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello, I would like to make an enquiry on House-In."
  )}`;

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
              <li>Email: contact@house-in.online</li>
              <li>Phone: +23408075990912</li>
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

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[#151515]"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
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