"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    try {
      const res = await api.post<{ url: string }>("/api/upload", fd);
      onChange(res.url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-bg/80 text-text hover:bg-danger/20"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-black/[0.02] dark:bg-white/[0.02] text-text-muted transition-colors hover:border-border-strong hover:bg-black/[0.03] dark:hover:bg-white/[0.03] disabled:opacity-50"
        >
          <Upload className="size-5" />
          <span className="text-sm">{loading ? "Uploading…" : "Click to upload"}</span>
          <span className="font-mono text-xs text-text-subtle">PNG · JPG · WebP · max 5MB</span>
        </button>
      )}
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={() => inputRef.current?.click()} disabled={loading}>
          {value ? "Replace" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
