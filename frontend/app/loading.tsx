import Loader from "./Components/Loader/Loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-transparent font-sans">
      <Loader />
      
      <p className="text-lg font-medium text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}