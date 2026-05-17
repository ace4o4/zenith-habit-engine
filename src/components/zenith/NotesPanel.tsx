import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotes } from "@/store/notes";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const MAX_LEN = 20000;

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function NotesPanel({ open, onOpenChange }: Props) {
  const { text, setText, hydrated, setHydrated } = useNotes();
  const isMobile = useIsMobile();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const counterId = "notes-counter";

  useEffect(() => {
    if (open && !hydrated) {
      useNotes.persist.rehydrate()?.then(() => setHydrated(true));
    }
    if (open) {
      const t = setTimeout(() => taRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open, hydrated, setHydrated]);

  // "Saved" pulse after the user pauses typing
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      setSavedFlash(true);
      const off = setTimeout(() => setSavedFlash(false), 900);
      return () => clearTimeout(off);
    }, 350);
    return () => clearTimeout(id);
  }, [text, hydrated]);

  const onChange = (v: string) => setText(v);

  const overLimit = text.length >= MAX_LEN;
  const words = useMemo(() => countWords(text), [text]);
  const chars = text.length;
  const readMinutes = Math.max(1, Math.round(words / 200));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setAnnounce("Notes copied to clipboard");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setAnnounce("Copy failed");
    }
  };

  const handleClear = () => {
    if (!text) return;
    const ok = window.confirm("Clear all notes? This can't be undone.");
    if (!ok) return;
    setText("");
    setAnnounce("Notes cleared");
    taRef.current?.focus();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "h-[92vh] rounded-t-2xl border-t border-border bg-background p-0"
            : "w-full bg-background p-0 sm:w-[460px] sm:max-w-md"
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

          <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-4 sm:p-5">
            <div className="min-w-0">
              <SheetTitle className="text-lg font-semibold tracking-tight text-foreground">
                Notes
              </SheetTitle>
              <SheetDescription className="mt-0.5 text-[12px] text-muted-foreground">
                A single, quiet space. Saved automatically to this device.
              </SheetDescription>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                aria-label="Copy notes"
                title="Copy"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
              >
                {copied ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!text}
                aria-label="Clear notes"
                title="Clear"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary hover:text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </header>

          <div role="status" aria-live="polite" className="sr-only">
            {announce}
          </div>

          <div className="flex flex-1 flex-col px-5 pb-3">
            <label htmlFor="notes-textarea" className="sr-only">
              Notes
            </label>
            <textarea
              id="notes-textarea"
              ref={taRef}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              maxLength={MAX_LEN}
              placeholder="Start typing…"
              aria-describedby={counterId}
              className="h-full w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground outline-none [overscroll-behavior:contain]"
            />
          </div>

          <div
            id={counterId}
            className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[11px] tabular-nums text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <span aria-label={`${words} words`}>{words} {words === 1 ? "word" : "words"}</span>
              <span aria-hidden>·</span>
              <span className={overLimit ? "text-destructive" : ""}>
                {chars.toLocaleString()} / {MAX_LEN.toLocaleString()}
              </span>
              <span aria-hidden>·</span>
              <span>{readMinutes} min read</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 transition-colors ${
                savedFlash ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  savedFlash ? "bg-[var(--accent)]" : "bg-border"
                }`}
                aria-hidden
              />
              Saved
            </span>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
