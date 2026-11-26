import { createClient } from "../supabase/server";
import type { RecipeListItem, RecipeWithIngredients } from "../../types/recipes";

export async function getRecipes(): Promise<RecipeListItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(count)')
        .order('position')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching recipes: ', error);
        return [];
    }
    return data;
}

export async function getRecipe(id: string): Promise<RecipeWithIngredients | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*)')
        .eq('id', id)
        .order('position', { referencedTable: 'recipe_ingredients' })
        .maybeSingle();
    if (error) {
        console.error('Error fetching recipe: ', error);
        return null;
    }
    return data;
}
