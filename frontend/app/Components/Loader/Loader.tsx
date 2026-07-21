import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return (
    <div
      className={cn(
        "h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-accent",
        className
      )}
    />
  );
}