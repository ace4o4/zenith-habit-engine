import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotes } from "@/store/notes";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const MAX_LEN = 20000;

export function NotesPanel({ open, onOpenChange }: Props) {
  const { text, setText, hydrated, setHydrated } = useNotes();
  const [touched, setTouched] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && !hydrated) {
      useNotes.persist.rehydrate()?.then(() => setHydrated(true));
    }
  }, [open, hydrated, setHydrated]);

  const onChange = (v: string) => {
    setText(v);
    if (!touched) setTouched(true);
  };

  const overLimit = text.length >= MAX_LEN;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "h-[88vh] rounded-t-2xl border-t border-border bg-background p-0"
            : "w-full bg-background p-0 sm:w-[420px] sm:max-w-md"
        }
      >
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 24 : 0, x: isMobile ? 0 : 24 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="flex h-full flex-col"
        >
          {isMobile && (
            <div className="flex justify-center pt-2">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden />
            </div>
          )}

          <header className="px-5 pb-3 pt-4 sm:p-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Notes</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              A single, quiet space. Saves automatically.
            </p>
          </header>

          <div className="flex flex-1 flex-col px-5 pb-3">
            <textarea
              value={text}
              onChange={(e) => onChange(e.target.value)}
              maxLength={MAX_LEN}
              placeholder="Start typing…"
              className="h-full w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground outline-none [overscroll-behavior:contain]"
            />
          </div>

          <div className="border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between text-[11px] text-muted-foreground">
            <span className={overLimit ? "text-destructive" : ""}>
              {text.length.toLocaleString()} / {MAX_LEN.toLocaleString()}
            </span>
            <span>{touched ? "Saved" : "Auto-saved"}</span>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
