import { RecipeForm } from "@/app/components/RecipeForm";
import { Suspense } from "react";


export default function NewRecipePage() {
    return (
         <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">New recipe</h1>
            <Suspense fallback={<p>Loading…</p>}>
            
            <RecipeForm />
            </Suspense>
        </div>
    )
}