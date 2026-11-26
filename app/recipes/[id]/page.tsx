import { RecipeDetails } from "@/app/components/RecipeDetails";
import Link from "next/link";
import { Suspense } from "react";


export default function RecipePage(props: PageProps<'/recipes/[id]'>) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Link href="/recipes" className="text-sm opacity-70">← All recipes</Link>
            <Suspense fallback={<p>Loading recipe…</p>}>
                <RecipeDetails params={props.params} />
            </Suspense>
        </div>
    );
}