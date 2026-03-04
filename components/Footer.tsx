import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 bg-[#111111] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <p className="text-lg font-extrabold tracking-tight">
              House-In
            </p>
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
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-extrabold tracking-widest uppercase text-gray-400">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/for-sale" className="hover:text-white text-gray-400">
                  For Sale
                </Link>
              </li>
              <li>
                <Link href="/for-rent" className="hover:text-white text-gray-400">
                  For Rent
                </Link>
              </li>
              <li>
                <Link href="/shortlet" className="hover:text-white text-gray-400">
                  Shortlet
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-white text-gray-400">
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
                <Link href="/contact" className="hover:text-white text-gray-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white text-gray-400">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white text-gray-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white text-gray-400">
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
              <li>Email: support@house-in.ng</li>
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

        {/* Bottom strip */}
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