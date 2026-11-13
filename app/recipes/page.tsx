'use client';

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RecipePage() {
      const [user, setUser] = useState<User | null>(null);
      const router = useRouter();
  
      useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user);
        }
      })
  
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user)
        }
      })
  
      return () => subscription.unsubscribe()
    }, [router]);
  
  
  return (
    <div>
      <p>Recipe page</p>
    </div>
  )
}