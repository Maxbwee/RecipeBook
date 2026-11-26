import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe } from "../lib/server/recipes";
import { DeleteRecipeButton } from "./DeleteRecipeButton";

export async function RecipeDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) notFound();

    const times = [
        recipe.servings && `Serves ${recipe.servings}`,
        recipe.prep_minutes && `Prep ${recipe.prep_minutes} min`,
        recipe.cook_minutes && `Cook ${recipe.cook_minutes} min`,
    ].filter(Boolean);

    return (
        <article className="flex flex-1 flex-col gap-6">
            <header className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold">{recipe.name}</h1>
                    <Link href={`/recipes/${recipe.id}/edit`} className="shrink-0 rounded-lg bg-mustard px-4 py-2 font-semibold text-pot">
                        Edit
                    </Link>
                </div>
                {recipe.description && <p className="opacity-80">{recipe.description}</p>}
                {times.length > 0 && <p className="text-sm opacity-70">{times.join(" · ")}</p>}
            </header>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Ingredients</h2>
                {recipe.recipe_ingredients.length === 0 ? (
                    <p className="opacity-60">No ingredients added.</p>
                ) : (
                    <ul className="flex flex-col gap-1 rounded-lg bg-surface p-4">
                        {recipe.recipe_ingredients.map((ing) => (
                            <li key={ing.id}>
                                {ing.quantity != null && <span className="font-semibold">{ing.quantity} </span>}
                                {ing.unit && <span className="font-semibold">{ing.unit} </span>}
                                {ing.name}
                                {ing.note && <span className="opacity-60">, {ing.note}</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {recipe.instructions && (
                <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Cooking Instructions</h2>
                    <p className="whitespace-pre-line">{recipe.instructions}</p>
                </section>
            )}

            {/* mt-auto pushes the footer to the bottom of the screen on short
                recipes; on long ones it simply follows the method. */}
            <footer className="mt-auto flex flex-col gap-2 pt-6">
                <DeleteRecipeButton recipeId={recipe.id} />
            </footer>
        </article>
        
    );
}