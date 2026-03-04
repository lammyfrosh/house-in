import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[var(--color-primary-dark)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          House-In
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-extrabold tracking-widest md:flex">
  <Link href="/for-sale" className="uppercase hover:opacity-90">
    For Sale
  </Link>
  <Link href="/for-rent" className="uppercase hover:opacity-90">
    For Rent
  </Link>
  <Link href="/shortlet" className="uppercase hover:opacity-90">
    Shortlet
  </Link>
  <Link href="/requests" className="uppercase hover:opacity-90">
    Requests
  </Link>
</nav>
        <div className="flex items-center gap-2">
          <Link
  href="/register"
  className="hidden rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold tracking-widest uppercase text-white hover:bg-white/10 md:inline-flex"
>
  Register
</Link>

<Link
  href="/signin"
  className="hidden rounded-xl border border-white/40 px-3 py-2 text-xs font-extrabold tracking-widest uppercase text-white hover:bg-white/10 md:inline-flex"
>
  Sign In
</Link>

<Link
  href="/add-property"
  className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-[var(--color-primary-dark)] hover:opacity-90"
>
  Add Property
</Link>
        </div>
      </div>

      <div className="border-t border-white/20 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm font-bold">
          <Link href="/for-sale" className="hover:underline">
            Sale
          </Link>
          <Link href="/for-rent" className="hover:underline">
            Rent
          </Link>
          <Link href="/requests" className="hover:underline">
            Requests
          </Link>
          <Link href="/signin" className="hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}