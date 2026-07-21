"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 bg-transparent font-sans text-center px-4">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-destructive">
          Something went wrong!
        </h2>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred in the application.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="flex items-center justify-center h-[44px] px-8 rounded-[60px] bg-accent font-medium text-base text-white transition-opacity duration-300 ease-in-out hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}