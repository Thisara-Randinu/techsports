import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-3xl border border-[#18201f]/10 bg-white/85 p-8 shadow-[0_10px_24px_rgba(24,32,31,0.05)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-[#4f5d5b]">
          Warranty Portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#18201f]">Sign in</h1>
        <p className="mt-3 text-sm text-[#3f4a48]">
          Configure Clerk redirect URLs to keep authentication inside the
          <strong> /warranty</strong> portal.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="rounded-full bg-[#18201f] px-5 py-2 text-sm font-medium text-white"
          >
            Open Admin
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#18201f]/20 px-5 py-2 text-sm font-medium text-[#18201f]"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
