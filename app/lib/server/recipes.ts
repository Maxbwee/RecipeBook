import { createClient } from "../supabase/server";
import type { Recipes } from "../../types/recipes";

export async function getRecipes(): Promise<Recipes[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('position')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching recipes: ', error);
        return [];
    }
    return data;
}
