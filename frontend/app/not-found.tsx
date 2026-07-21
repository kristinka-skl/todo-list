import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 bg-transparent font-sans text-center px-4">
      <div className="space-y-3">
        <h2 className="text-6xl font-bold tracking-tight text-foreground">404</h2>
        <p className="text-2xl font-semibold text-foreground">Page not found</p>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center h-[44px] px-8 rounded-[60px] bg-accent font-medium text-base text-white transition-opacity duration-300 ease-in-out hover:opacity-90"
      >
        Return Home
      </Link>
    </div>
  );
}