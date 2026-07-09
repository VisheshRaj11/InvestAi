import { cn } from "@/lib/utils";

interface VerdictPillProps {
  verdict: "Invest" | "Pass" | "Watch";
  className?: string;
}

export function VerdictPill({ verdict, className }: VerdictPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold tracking-wide uppercase transition-colors",
        verdict === "Invest" && "bg-foreground text-background",
        verdict === "Pass" && "border-2 border-muted-foreground text-foreground bg-transparent",
        verdict === "Watch" && "border-2 border-dashed border-foreground text-foreground bg-transparent",
        className
      )}
    >
      {verdict}
    </div>
  );
}
