"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteListing } from "@/app/dashboard/listings/actions";

interface DeleteListingButtonProps {
  id: string;
  title: string;
}

export function DeleteListingButton({ id, title }: DeleteListingButtonProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete(): Promise<void> {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await deleteListing(id);
          if (result?.error) {
            toast.error(result.error);
          } else if (result?.count === 0) {
            toast.error("Delete failed — listing may already be removed.");
          } else {
            toast.success("Listing deleted.");
            setOpen(false);
            router.refresh();
          }
        } catch {
          toast.error("Something went wrong.");
        } finally {
          resolve();
        }
      });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-caption text-error hover:underline"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Delete listing?"
        description={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
      />
    </>
  );
}
