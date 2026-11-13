'use client';

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [user, SetUser] = useState<User | null>(null);
  const router = useRouter();


  useEffect(() => {
    supabase.auth.getSession().then(({data: {session} }) => {
      if (!session) {
        router.push('/login');
      } else {
        SetUser(session.user);
      }
    })

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        SetUser(session.user);
      }
    });

     return () => subscription.unsubscribe();
  
  }, [router]);


  // Todo: Get user recipes

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

      </main>
    </div>
  );
}
