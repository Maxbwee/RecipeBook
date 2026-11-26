'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { House, User, CookingPot, ShoppingCart } from "lucide-react";

const navItems = [
    { href: "/", icon: House, label: "Home" },
    { href: "/recipes", icon: CookingPot, label: "Recipes" },
    { href: "/groceries", icon: ShoppingCart, label: "Groceries" },
    { href: "/profile", icon: User, label: "Profile" },
];

// On pages with a URL value only known per request (e.g. /recipes/[id]),
// usePathname() has to wait for the request. The Suspense fallback shows the
// same bar with no tab highlighted until then, so the bar never disappears.
export default function MobileNavBar() {
    return (
        <Suspense fallback={<NavBar pathname={null} />}>
            <ActiveNavBar />
        </Suspense>
    );
}

function ActiveNavBar() {
    const pathname = usePathname();

    if (pathname === "/login") {
        return null;
    }

    return <NavBar pathname={pathname} />;
}

function NavBar({ pathname }: { pathname: string | null }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around p-4 bg-pot border-t-4 border-tomato shadow sm:hidden">
            {navItems.map(({ href, label, icon: Icon }) => {
                // "/recipes" stays highlighted on /recipes/abc and /recipes/abc/edit
                const isActive = href === "/"
                    ? pathname === "/"
                    : pathname === href || !!pathname?.startsWith(`${href}/`);
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
