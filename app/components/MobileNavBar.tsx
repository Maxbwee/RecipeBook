'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, User, CookingPot } from "lucide-react";


export default function MobileNavBar() {

    const navItems = [
        { href: "/", icon: House, label: "Home" },
        { href: "/recipes", icon: CookingPot, label: "Recipes" },
        { href: "/profile", icon: User, label: "Profile" },

    ]

    const pathname = usePathname();
    
    if (pathname === "/login") {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around p-4 bg-pot border-t-4 border-tomato shadow sm:hidden">
            {navItems.map(({href, label, icon: Icon}) => {
                const isActive = pathname === href; 
                return (
                    <Link key={href} href={href} className={`flex flex-col items-center ${isActive ? "text-mustard" : "text-cream/60"}`}>
                        <Icon />
                        {label}
                    </Link>
                );
            })}
            </nav>
    );

}