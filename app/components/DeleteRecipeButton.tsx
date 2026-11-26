'use client';

import { useRouter } from "next/navigation";
import { deleteRecipe } from "../lib/client/recipes";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";


export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {

    const router = useRouter();
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        setError("");

        const deleted = await deleteRecipe(recipeId);

        if (!deleted) {
            setDeleting(false);
            setConfirmOpen(false);
            return setError("Deleting failed!");
        }

        router.push('/recipes');
        router.refresh();
    }

    return (
        <>
            {error && <p className="text-tomato">{error}</p>}

            <button
                onClick={() => setConfirmOpen(true)}
                className="w-full rounded-lg border border-tomato-dark px-4 py-3 font-semibold text-tomato-dark"
            >
                Delete recipe
            </button>

            <ConfirmDialog
                open={confirmOpen}
                title="Delete this recipe?"
                message="Its ingredients will be deleted too. This can't be undone."
                confirmLabel={deleting ? "Deleting…" : "Delete"}
                destructive
                busy={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );

}