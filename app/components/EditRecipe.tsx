import { notFound } from "next/navigation";
import { getRecipe } from "../lib/server/recipes";
import { RecipeForm } from "./RecipeForm";

export async function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recipe = await getRecipe(id);
    if (!recipe) notFound();

    return <RecipeForm recipe={recipe} />;
}