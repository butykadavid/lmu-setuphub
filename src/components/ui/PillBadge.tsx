import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeColor =
  | "lime"
  | "blue"
  | "amber"
  | "red"
  | "neutral"
  | "primary";

type BadgeMode =
  | "default"
  | "hero"
  | "compact";

interface PillBadgeProps {
  text: string;
  logo?: ReactNode;
  color?: BadgeColor;
  mode?: BadgeMode;
  className?: string;
}

const colorStyles = {
  lime: "border-lime-400/20 bg-lime-400/10 text-lime-300",
  blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  red: "border-red-400/20 bg-red-400/10 text-red-300",
  neutral: "border-white/10 bg-white/5 text-white/70",
  primary: "border-primary/20 bg-primary/10 text-primary"
};

const modeStyles = {
  hero: "px-4 py-2 text-sm gap-2",
  default: "px-3 py-1.5 text-sm gap-2",
  compact: "px-2.5 py-1 text-xs gap-1.5",
};

export function PillBadge({
  text,
  logo,
  color = "neutral",
  mode = "default",
  className,
}: PillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium my-6",
        colorStyles[color],
        modeStyles[mode],
        className
      )}
    >
      {logo && (
        <span className="flex items-center justify-center">
          {logo}
        </span>
      )}

      <span>{text}</span>
    </div>
  );
}