import { Suspense } from "react";
import { UserEmail } from "../components/UserEmail";

export default function Profile() {
    return(
        <div>
            <p>Profile page</p>
            <Suspense fallback={<p>Loading…</p>}>
                <UserEmail />
            </Suspense>
        </div>
    )
}