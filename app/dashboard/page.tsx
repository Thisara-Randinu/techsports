import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-16">
      <section className="rounded-3xl border border-[#18201f]/10 bg-white/85 p-8 shadow-[0_10px_24px_rgba(24,32,31,0.05)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-[#4f5d5b]">
          Embedded Warranty Portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#18201f]">
          Warranty Dashboard
        </h1>
        <p className="mt-3 text-sm text-[#3f4a48]">
          Manage warranty workflows in the same design language as the main
          website.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="rounded-full bg-[#18201f] px-5 py-2 text-sm font-medium text-white"
          >
            Manage Products
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#18201f]/20 px-5 py-2 text-sm font-medium text-[#18201f]"
          >
            Portal Home
          </Link>
        </div>
      </section>
    </main>
  );
}
