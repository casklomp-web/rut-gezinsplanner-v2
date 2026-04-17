"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
        checked ? "bg-[#4A90A4]" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
