import { cn } from "../../lib/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse bg-muted rounded-xl", className)} />;
}
