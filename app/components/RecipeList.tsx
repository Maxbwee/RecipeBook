import Link from "next/link";
import { getRecipes } from "../lib/server/recipes";


export async function RecipeList() {
    const recipes = await getRecipes();

    if (recipes.length === 0) {
        return <p className="text-center opacity-60">No recipes yet. Add your first one!</p>;
    }


    return (
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe.id}>
                    <Link href={`/recipes/${recipe.id}`} className="block rounded-lg bg-white p-4 shadow">
                        <p className="font-semibold">{recipe.name}</p>
                        {recipe.description && <p className="text-sm opacity-60">{recipe.description}</p>}
                    </Link>

                </li>
            ))}
        </ul>
    );
}