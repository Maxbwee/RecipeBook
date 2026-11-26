'use client';

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
    /** Show or hide the popup. The parent owns this state. */
    open: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Red confirm button, for actions that delete or can't be undone. */
    destructive?: boolean;
    /** While true, both buttons are disabled and the popup can't be closed. */
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

/**
 * A confirmation popup styled to match the app.
 *
 * Built on the HTML <dialog> element, so the browser dims the page behind it,
 * keeps keyboard focus inside it and closes it on Escape.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <button onClick={() => setOpen(true)}>Delete</button>
 *   <ConfirmDialog open={open} title="Delete recipe?" destructive
 *       onConfirm={...} onCancel={() => setOpen(false)} />
 */
export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    busy = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const messageId = useId();

    // Keep the <dialog> element in step with the `open` prop
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function requestCancel() {
        if (!busy) onCancel();
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={message ? messageId : undefined}
            // Escape key: let the parent decide by updating `open`
            onCancel={(e) => {
                e.preventDefault();
                requestCancel();
            }}
            // A click on the dimmed area outside the box lands on <dialog> itself
            onClick={(e) => {
                if (e.target === e.currentTarget) requestCancel();
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-surface text-foreground shadow-xl backdrop:bg-black/50"
        >
            <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1">
                    <h2 id={titleId} className="text-lg font-bold">{title}</h2>
                    {message && <p id={messageId} className="opacity-80">{message}</p>}
                </div>

                <div className="flex gap-3">
                    {/* Cancel comes first and gets focus, so Enter never confirms by accident */}
                    <button
                        type="button"
                        autoFocus
                        disabled={busy}
                        onClick={requestCancel}
                        className="flex-1 rounded-lg border border-field-border py-3 font-semibold disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onConfirm}
                        className={`flex-1 rounded-lg py-3 font-semibold disabled:opacity-50 ${
                            destructive ? "bg-tomato-dark text-cream" : "bg-mustard text-pot"
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
