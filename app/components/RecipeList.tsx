import Link from "next/link";
import { Carrot, Clock, Users } from "lucide-react";
import { getRecipes } from "../lib/server/recipes";


export async function RecipeList() {
    const recipes = await getRecipes();

    if (recipes.length === 0) {
        return <p className="text-center opacity-60">No recipes yet. Add your first one!</p>;
    }


    return (
        <ul className="flex flex-col gap-3">
            {recipes.map((recipe) => {
                const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
                const ingredientCount = recipe.recipe_ingredients[0]?.count ?? 0;

                return (
                    <li key={recipe.id}>
                        <Link href={`/recipes/${recipe.id}`} className="flex gap-3 rounded-lg bg-surface p-3 shadow">
                            {/* Picture tile: first letter for now, recipe photo once uploads exist */}
                            <div
                                aria-hidden="true"
                                className="flex size-16 shrink-0 items-center justify-center rounded-md bg-mustard text-2xl font-bold text-pot"
                            >
                                {recipe.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex min-w-0 flex-col gap-1">
                                <p className="truncate font-semibold">{recipe.name}</p>
                                {recipe.description && (
                                    <p className="line-clamp-2 text-sm opacity-70">{recipe.description}</p>
                                )}
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-70">
                                    {totalMinutes > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} aria-hidden="true" />
                                            {totalMinutes} min
                                        </span>
                                    )}
                                    {recipe.servings != null && (
                                        <span className="flex items-center gap-1">
                                            <Users size={14} aria-hidden="true" />
                                            Serves {recipe.servings}
                                        </span>
                                    )}
                                    {ingredientCount > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Carrot size={14} aria-hidden="true" />
                                            {ingredientCount} {ingredientCount === 1 ? "ingredient" : "ingredients"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
