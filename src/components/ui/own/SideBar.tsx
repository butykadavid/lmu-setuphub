"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideBar({
  open = false,
  onClose,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition pointer-events-none",
        open && "pointer-events-auto"
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-background shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {children}
      </aside>
    </div>
  );
}