import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNotes } from "@/store/notes";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function NotesPanel({ open, onOpenChange }: Props) {
  const { text, setText, hydrated, setHydrated } = useNotes();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (open && !hydrated) {
      useNotes.persist.rehydrate()?.then(() => setHydrated(true));
    }
  }, [open, hydrated, setHydrated]);

  const onChange = (v: string) => {
    setText(v);
    setSavedAt(Date.now());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full bg-background p-0 sm:max-w-md sm:w-[420px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-5 text-left">
            <SheetTitle>Notes</SheetTitle>
            <SheetDescription>
              A single, quiet space. Saves automatically.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col p-5">
            <textarea
              value={text}
              onChange={(e) => onChange(e.target.value)}
              maxLength={20000}
              placeholder="Start typing…"
              className="h-full w-full resize-none bg-transparent text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground outline-none"
            />
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{text.length.toLocaleString()} / 20,000</span>
              <span>{savedAt ? "Saved" : "Auto-saved"}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
