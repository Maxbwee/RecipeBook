import { notFound } from "next/navigation";
import { getRecipe } from "../lib/server/recipes";
import { RecipeForm } from "./RecipeForm";

export async function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recipe = await getRecipe(id);
    if (!recipe) notFound();

    // A new key makes React start the form fresh. updated_at changes on every
    // save, so a kept-alive edit page never shows values from before an edit.
    return <RecipeForm key={`${recipe.id}-${recipe.updated_at}`} recipe={recipe} />;
}