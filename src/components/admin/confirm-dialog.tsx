"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = "Confirm", destructive = false, onConfirm,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try { await onConfirm(); onOpenChange(false); } finally { setLoading(false); }
            }}
          >
            {loading ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
