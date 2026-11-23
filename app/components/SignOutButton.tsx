// app/components/SignOutButton.tsx
'use client';

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";

export function SignOutButton() {
    const router = useRouter();

    async function signOut() {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    }

    return <button
        onClick={signOut}
        className="w-full rounded-lg bg-tomato px-4 py-3 font-semibold text-cream active:opacity-80">
        Sign out
    </button>;
}
