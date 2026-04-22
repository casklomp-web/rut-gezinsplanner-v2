'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ShoppingCart, ChefHat, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/today", label: "Vandaag", icon: Calendar },
  { href: "/week", label: "Week", icon: ClipboardList },
  { href: "/tasks", label: "Taken", icon: ClipboardList },
  { href: "/shopping", label: "Boodschappen", icon: ShoppingCart },
  { href: "/recipes", label: "Recepten", icon: ChefHat },
  { href: "/profile", label: "Profiel", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  // Don't show sidebar on mobile or onboarding
  if (pathname === '/onboarding') return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#4A90A4]">Rut</h1>
        <p className="text-sm text-gray-500">Gezinsplanner</p>
      </div>
      
      <nav className="flex-1 px-4 py-4" role="navigation" aria-label="Hoofdnavigatie">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive 
                      ? "bg-[#4A90A4]/10 text-[#4A90A4] font-medium" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">© 2024 Rut Gezinsplanner</p>
      </div>
    </aside>
  );
}
