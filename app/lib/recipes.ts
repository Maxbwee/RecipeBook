import { supabase } from "./supabase/client";
import type { NewIngredient, NewRecipe, Recipes } from "../types/recipes";


export async function getRecipes() {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(20);
    if (error) {
        console.error('Error fetching recipes: ', error)
        return [];
    }
    return data;
}

// Todo: Recipes by name

export async function createRecipe(recipe: NewRecipe): Promise<Recipes | null> {
    const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();
    if (error) {
        console.error('Error creating recipe: ', error)
        return null;
    }
    return data;
}

export async function updateRecipe(id: string, changes: Partial<NewRecipe>) {
    const {data, error} = await supabase
        .from('recipes')
        .update(changes)
        .eq('id', id)
        .select()
        .single();
    if(error) {
        console.error('Error updating recipe: ', error)
    }

    return error ? null : data;
}

export async function addIngredients(recipeId: string, ingredients: NewIngredient[]) {
    const rows = ingredients.map((ing, i) => ({ ...ing, recipe_id: recipeId, position: i }))
    const { error } = await supabase
        .from('recipe_ingredients')
        .insert(rows)
    if (error) {
        console.error('Error adding ingredients', error);
    }
    return !error
}

export async function replaceIngredients(recipeId: string, ingredients: NewIngredient[]) {
    const { error } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);
    if (error) {
        console.error('Error clearing ingredients', error);
        return false;
    }
    return addIngredients(recipeId, ingredients);
}