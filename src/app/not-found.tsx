import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <p className="font-display text-5xl font-semibold text-line-strong">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold tracking-tight">
        That page isn&apos;t on the brief
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep"
      >
        Back to the dashboard
      </Link>
    </div>
  );
}
