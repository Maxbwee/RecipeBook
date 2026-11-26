'use client';

import { useRouter } from "next/navigation";
import type { IngredientRow, RecipeWithIngredients } from "../types/recipes";
import { useState } from "react";
import { addIngredients, createRecipe, replaceIngredients, updateRecipe } from "../lib/client/recipes";


const emptyRow = (): IngredientRow => ({ key: crypto.randomUUID(), name: "", quantity: "", unit: "" });

export function RecipeForm({recipe}: { recipe?: RecipeWithIngredients}) {
    const router = useRouter();


    // Start from the recipe's values when editing, or empty when creating
    const [name, setName] = useState(recipe?.name ?? "");
    const [description, setDescription] = useState(recipe?.description ?? "");
    const [instructions, setInstructions] = useState(recipe?.instructions ?? "");
    const [servings, setServings] = useState(recipe?.servings?.toString() ?? "");
    const [prepMinutes, setPrepMinutes] = useState(recipe?.prep_minutes?.toString() ?? "");
    const [cookMinutes, setCookMinutes] = useState(recipe?.cook_minutes?.toString() ?? "");
    const [ingredients, setIngredients] = useState<IngredientRow[]>(
        recipe?.recipe_ingredients.length
            ? recipe.recipe_ingredients.map((ing) => ({
                  key: ing.id,
                  name: ing.name,
                  quantity: ing.quantity?.toString() ?? "",
                  unit: ing.unit ?? "",
              }))
            : [{ key: "first", name: "", quantity: "", unit: "" }]
    );
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);


    function removeRow(key: string) {
        setIngredients((rows) => rows.filter((r) => r.key !== key));
    }

    function updateRow(key: string, field: keyof IngredientRow, value: string) {
        setIngredients((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        // Stop the browser's built-in form submit, which reloads the page
        // before the save below has finished.
        e.preventDefault();

        if (!name.trim()) {
            return setError("Give your recipe a name!");
        }
        setSaving(true);
        setError("");

        const details = {
            name: name.trim(),
            description: description.trim() || null,
            instructions: instructions.trim() || null,
            servings: servings ? Number(servings) : null,
            prep_minutes: prepMinutes ? Number(prepMinutes) : null,
            cook_minutes: cookMinutes ? Number(cookMinutes) : null,
        };

        // Skip rows left empty
        const rows = ingredients
            .filter((r) => r.name.trim())
            .map((r) => ({
                name: r.name.trim(),
                quantity: r.quantity ? Number(r.quantity) : null,
                unit: r.unit.trim() || null,
            }));

        // Editing updates the existing recipe; otherwise create a new one
        const saved = recipe
            ? await updateRecipe(recipe.id, details)
            : await createRecipe(details);

        if (!saved) {
            setSaving(false);
            return setError("Couldn't save the recipe. Try again!");
        }

        const ingredientsSaved = recipe
            ? await replaceIngredients(saved.id, rows) // also deletes removed ingredients
            : rows.length === 0 || await addIngredients(saved.id, rows);

        if (!ingredientsSaved) {
            setSaving(false);
            return setError("The recipe saved, but its ingredients didn't. Try again!");
        }

        router.push(`/recipes/${saved.id}`);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <p className="text-tomato">{error}</p>}

            {/* Details */}
            <section className="flex flex-col gap-3">
                <input placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} />
                <textarea
                    rows={2}
                    placeholder="Short description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                    <input type="number" inputMode="numeric" placeholder="Serves" value={servings} onChange={(e) => setServings(e.target.value)} />
                    <input type="number" inputMode="numeric" placeholder="Prep (min)" value={prepMinutes} onChange={(e) => setPrepMinutes(e.target.value)} />
                    <input type="number" inputMode="numeric" placeholder="Cook (min)" value={cookMinutes} onChange={(e) => setCookMinutes(e.target.value)} />
                </div>
            </section>

            {/* Ingredients */}
            <section className="flex flex-col gap-2">
                <h2 className="font-semibold">Ingredients</h2>
                {ingredients.map((row) => (
                    <div key={row.key} className="flex gap-2">
                        <input className="w-16" inputMode="decimal" placeholder="Qty" value={row.quantity} onChange={(e) => updateRow(row.key, "quantity", e.target.value)} />
                        <input className="w-16" placeholder="Unit" value={row.unit} onChange={(e) => updateRow(row.key, "unit", e.target.value)} />
                        <input className="flex-1" placeholder="Ingredient" value={row.name} onChange={(e) => updateRow(row.key, "name", e.target.value)} />
                        <button type="button" onClick={() => removeRow(row.key)} aria-label="Remove ingredient" className="shrink-0 px-2 text-tomato">✕</button>
                    </div>
                ))}
                <button type="button" onClick={() => setIngredients((rows) => [...rows, emptyRow()])} className="rounded-lg border border-dashed border-field-border py-2 font-semibold">

                    + Add ingredient
                </button>
            </section>

            {/* Cooking Instructions */}
            <section className="flex flex-col gap-2">
                <h2 className="font-semibold">Cooking Instructions</h2>
                <textarea rows={8} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </section>

            <button type="submit" disabled={saving} className="rounded-lg bg-mustard py-3 font-semibold text-pot disabled:opacity-50">
                {saving ? "Saving…" : recipe ? "Save changes" : "Save recipe"}
            </button>
        </form>
    );
}