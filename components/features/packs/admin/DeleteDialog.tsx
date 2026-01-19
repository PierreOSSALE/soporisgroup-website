"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Pack } from "@/types/pack";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packToDelete: Pack | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  packToDelete,
  isDeleting,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le pack{" "}
            <span className="font-semibold text-foreground">
              {packToDelete?.name}
            </span>
            ? Cette action est irréversible et supprimera définitivement le
            pack.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-700">
              Attention : Cette action ne peut pas être annulée. Toutes les
              données associées à ce pack seront définitivement supprimées.
            </p>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
