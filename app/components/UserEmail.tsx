import { createClient } from "../lib/supabase/server";
// Reads the logged-in user, so it runs per request, not at build time.
export async function UserEmail() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const email = data?.claims?.email;

    return email ? <p>Logged in as {email}</p> : null;
}