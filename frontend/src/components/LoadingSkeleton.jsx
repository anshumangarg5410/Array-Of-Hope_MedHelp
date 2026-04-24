export default function LoadingSkeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-[1.5rem] bg-white/60 dark:bg-white/5 ${className}`} />;
}
