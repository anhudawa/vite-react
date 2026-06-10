"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <h1 className="font-display text-xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Your data is safe — nothing is changed unless an action completes.
        {error.digest && (
          <span className="mt-1 block text-xs text-ink-faint">
            Reference: {error.digest}
          </span>
        )}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep"
      >
        Try again
      </button>
    </div>
  );
}
