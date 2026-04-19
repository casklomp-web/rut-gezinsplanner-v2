'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ShoppingCart, ChefHat, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptic, HAPTIC_PATTERNS } from "@/components/providers/HapticProvider";

const navItems = [
  { href: "/", label: "Vandaag", icon: Home },
  { href: "/week", label: "Week", icon: Calendar },
  { href: "/shopping", label: "Boodschappen", icon: ShoppingCart },
  { href: "/recipes", label: "Recepten", icon: ChefHat },
  { href: "/profile", label: "Profiel", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptic();

  // Don't show nav on onboarding
  if (pathname === '/onboarding') return null;

  const handleNavClick = () => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-40"
      role="navigation"
      aria-label="Hoofdnavigatie"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4A90A4]",
                isActive 
                  ? "text-[#4A90A4]" 
                  : "text-gray-400 hover:text-gray-600"
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
