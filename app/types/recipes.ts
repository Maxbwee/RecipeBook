export type Recipes = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    instructions: string | null;
    servings: number | null;
    prep_minutes: number | null;
    cook_minutes: number |null;
    image_path: string | null;
    position: number;
    created_at: string;
    updated_at: string;
}

// Fields the app sends when creating a recipe. id, user_id and the
// timestamps are filled in by the database.
export type NewRecipe = Pick<Recipes, 'name'> &
    Partial<Pick<Recipes,
        'description' | 'instructions' | 'servings' |
        'prep_minutes' | 'cook_minutes' | 'image_path' | 'position'>>;


export type Ingredient = {
    id: string;
    recipe_id: string;
    name: string;
    quantity: number | null;
    unit: string | null;
    note: string | null;
    position: number;
}

export type IngredientRow = {
    key: string;
    name: string;
    quantity: string;
    unit: string
}

export type NewIngredient = Pick<Ingredient, 'name'> &
    Partial<Pick<Ingredient, 'quantity' | 'unit' | 'note'>>;

export type RecipeWithIngredients = Recipes & {
    recipe_ingredients: Ingredient[];
}

// A recipe in the list: ingredients are only counted, not loaded.
// Supabase returns the count as a one-item array: [{ count: 8 }].
export type RecipeListItem = Recipes & {
    recipe_ingredients: { count: number }[];
}
