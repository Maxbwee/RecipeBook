import { EditRecipe } from "@/app/components/EditRecipe";
import { Suspense } from "react";


export default function EditRecipePage(props: PageProps<'/recipes/[id]/edit'>) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Edit recipe</h1>
            <Suspense fallback={<p>Loading recipe…</p>}>
                <EditRecipe params={props.params} />
            </Suspense>
        </div>
    );
}