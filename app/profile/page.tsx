import { Suspense } from "react";
import { UserEmail } from "../components/UserEmail";
import { SignOutButton } from "../components/SignOutButton";

export default function Profile() {
    return(
       <div className="flex flex-1 flex-col p-4">
            <p>Profile page</p>
            <Suspense fallback={<p>Loading…</p>}>
                <UserEmail />
            </Suspense>
            <div className="mt-auto">
                <SignOutButton/>
            </div>
        </div>
    )
}