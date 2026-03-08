import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 bg-[#111111] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-lg font-extrabold tracking-tight">House-In</p>
            <p className="mt-3 text-sm text-gray-400">
              Find properties for rent, sale and shortlet across selected
              states in Nigeria.
            </p>

            <div className="mt-5 rounded-2xl bg-[#1a1a1a] p-4">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Safety Tip:</span>{" "}
                Always inspect properties physically and verify documents
                before payment.
              </p>
            </div>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="rounded-xl bg-[#1a1a1a] p-2 text-gray-300 transition hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#1a1a1a] p-2 text-gray-300 transition hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#1a1a1a] p-2 text-gray-300 transition hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-xl bg-[#1a1a1a] p-2 text-gray-300 transition hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-extrabold tracking-widest uppercase text-gray-400">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/for-sale" className="text-gray-400 hover:text-white">
                  For Sale
                </Link>
              </li>
              <li>
                <Link href="/for-rent" className="text-gray-400 hover:text-white">
                  For Rent
                </Link>
              </li>
              <li>
                <Link href="/shortlet" className="text-gray-400 hover:text-white">
                  Shortlet
                </Link>
              </li>
              <li>
                <Link href="/requests" className="text-gray-400 hover:text-white">
                  Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-extrabold tracking-widest uppercase text-gray-400">
              Company
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-white">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-extrabold tracking-widest uppercase text-gray-400">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>Email: support@house-in.online</li>
              <li>Phone: +234 800 000 0000</li>
              <li>Hours: Mon–Sat, 9am–6pm</li>
            </ul>

            <Link
              href="/add-property"
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-black hover:bg-gray-200"
            >
              Add Property
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} House-In. All rights reserved.</p>
          <p className="text-xs">
            Built for Nigeria • Admin approval system coming next
          </p>
        </div>
      </div>
    </footer>
  );
}