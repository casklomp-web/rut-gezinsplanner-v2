"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ShoppingCart, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Vandaag", icon: Home },
  { href: "/week", label: "Week", icon: Calendar },
  { href: "/shopping", label: "Boodschappen", icon: ShoppingCart },
  { href: "/settings", label: "Meer", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive 
                  ? "text-[#4A90A4]" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
