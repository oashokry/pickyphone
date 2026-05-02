import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  isWinner?: boolean;
}

export default function SpecRow({ label, value, isWinner = false }: Props) {
  return (
    <div className={cn(
      "flex flex-col py-3 border-b border-border/50 last:border-0",
      isWinner && "bg-primary/5 -mx-4 px-4 rounded-md"
    )}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">{label}</span>
      <span className={cn(
        "text-sm",
        isWinner ? "text-primary font-semibold" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  );
}
