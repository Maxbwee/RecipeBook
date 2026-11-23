// proxy.ts redirects to /login before this page renders if no one is logged in.

import { Suspense } from "react";
import { RecipeList } from "../components/RecipeList";
import Link from "next/link";

export default function RecipePage() {
 return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Recipes</h1>
                <Link href="/recipes/new" className="rounded-lg bg-mustard px-4 py-2 font-semibold text-pot">
                    Add recipe
                </Link>
            </div>
            <Suspense fallback={<p>Loading recipes…</p>}>
                <RecipeList />
            </Suspense>
        </div>
    );
}
