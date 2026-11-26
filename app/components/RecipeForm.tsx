'use client';

import { useRouter } from "next/navigation";
import type { IngredientRow, RecipeWithIngredients } from "../types/recipes";
import { useState } from "react";
import { addIngredients, createRecipe, replaceIngredients, updateRecipe } from "../lib/client/recipes";


const emptyRow = (): IngredientRow => ({ key: crypto.randomUUID(), name: "", quantity: "", unit: "" });

// The form's starting values: the recipe's when editing, or empty when creating.
// Used both for the first render and for resetting the form.
function toFormValues(recipe?: RecipeWithIngredients) {
    return {
        name: recipe?.name ?? "",
        description: recipe?.description ?? "",
        instructions: recipe?.instructions ?? "",
        servings: recipe?.servings?.toString() ?? "",
        prepMinutes: recipe?.prep_minutes?.toString() ?? "",
        cookMinutes: recipe?.cook_minutes?.toString() ?? "",
        ingredients: recipe?.recipe_ingredients.length
            ? recipe.recipe_ingredients.map((ing) => ({
                  key: ing.id,
                  name: ing.name,
                  quantity: ing.quantity?.toString() ?? "",
                  unit: ing.unit ?? "",
              }))
            // Fixed key: crypto.randomUUID() isn't allowed while Next.js prerenders
            : [{ key: "first", name: "", quantity: "", unit: "" }],
    };
}

export function RecipeForm({recipe}: { recipe?: RecipeWithIngredients}) {
    const router = useRouter();

    const initial = toFormValues(recipe);
    const [name, setName] = useState(initial.name);
    const [description, setDescription] = useState(initial.description);
    const [instructions, setInstructions] = useState(initial.instructions);
    const [servings, setServings] = useState(initial.servings);
    const [prepMinutes, setPrepMinutes] = useState(initial.prepMinutes);
    const [cookMinutes, setCookMinutes] = useState(initial.cookMinutes);
    const [ingredients, setIngredients] = useState<IngredientRow[]>(initial.ingredients);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);


    // Next.js keeps recently visited pages alive in the background (with
    // cacheComponents on), so the form must be reset by hand: otherwise the
    // next visit would still show old or abandoned values.
    function resetForm(values = toFormValues(recipe)) {
        setName(values.name);
        setDescription(values.description);
        setInstructions(values.instructions);
        setServings(values.servings);
        setPrepMinutes(values.prepMinutes);
        setCookMinutes(values.cookMinutes);
        setIngredients(values.ingredients);
        setError("");
        setSaving(false);
    }

    // Edit form only: throw away unsaved changes and go back to the recipe
    function handleCancel() {
        if (!recipe) return;
        resetForm();
        router.push(`/recipes/${recipe.id}`);
    }

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

        if (recipe) {
            // Edit form: just re-enable the button. EditRecipe gives the form a
            // key based on updated_at, so it starts from the saved values next time.
            setSaving(false);
        } else {
            resetForm(toFormValues()); // empty, ready for the next new recipe
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

            <div className="flex gap-3">
                {/* Cancel only when editing; a new recipe has nowhere to go back to */}
                {recipe && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 rounded-lg border border-field-border py-3 font-semibold disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-mustard py-3 font-semibold text-pot disabled:opacity-50">
                    {saving ? "Saving…" : recipe ? "Save changes" : "Save recipe"}
                </button>
            </div>
        </form>
    );
}