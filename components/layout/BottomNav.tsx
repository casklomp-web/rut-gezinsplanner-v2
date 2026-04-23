'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ShoppingCart, User, ClipboardList, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptic, HAPTIC_PATTERNS } from "@/components/providers/HapticProvider";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { useUserStore } from "@/lib/store/userStore";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/today", label: "Dag", icon: Calendar },
  { href: "/week", label: "Week", icon: ClipboardList },
  { href: "/shopping", label: "Boodschappen", icon: ShoppingCart },
  { href: "/tasks", label: "Taken", icon: ClipboardList },
  { href: "/notifications", label: "Meldingen", icon: Bell, showBadge: true },
  { href: "/profile", label: "Profiel", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { vibrate } = useHaptic();
  const { currentUser } = useUserStore();
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;

  // Don't show nav on onboarding, auth, or landing
  if (pathname === '/onboarding' || pathname === '/auth' || pathname === '/landing' || pathname === '/') return null;

  const handleNavClick = () => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-40 lg:hidden"
      role="navigation"
      aria-label="Hoofdnavigatie"
    >
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4A90A4] relative",
                isActive 
                  ? "text-[#4A90A4]" 
                  : "text-gray-400 hover:text-gray-600"
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="mb-0.5"
                  aria-hidden="true"
                />
                {(item as any).showBadge && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
