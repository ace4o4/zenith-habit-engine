import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTodos } from "@/store/todos";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const MIN_LEN = 2;
const MAX_LEN = 200;

export function TodosPanel({ open, onOpenChange }: Props) {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted, hydrated, setHydrated } =
    useTodos();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && !hydrated) {
      useTodos.persist.rehydrate()?.then(() => setHydrated(true));
    }
  }, [open, hydrated, setHydrated]);

  const validate = (raw: string): string => {
    const t = raw.trim();
    if (!t) return "Type something to add.";
    if (t.length < MIN_LEN) return `Use at least ${MIN_LEN} characters.`;
    if (t.length > MAX_LEN) return `Keep it under ${MAX_LEN} characters.`;
    const exists = todos.some((x) => x.text.toLowerCase() === t.toLowerCase());
    if (exists) return "You already added this one.";
    return "";
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const msg = validate(draft);
    if (msg) {
      setError(msg);
      return;
    }
    addTodo(draft);
    setDraft("");
    setError("");
  };

  const onChange = (v: string) => {
    setDraft(v);
    if (!error) return;
    // live re-validate so the message clears as user fixes input
    const msg = validate(v);
    if (!msg) setError("");
    else setError(msg);
  };

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;
  const trimmedLen = draft.trim().length;
  const nearLimit = trimmedLen > MAX_LEN - 20;

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
          {/* Grabber */}
          {isMobile && (
            <div className="flex justify-center pt-2">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden />
            </div>
          )}

          {/* Header */}
          <header className="px-5 pb-3 pt-4 sm:p-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Todos</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {todos.length === 0
                ? "Capture your immediate next steps."
                : `${remaining} open · ${completed} done`}
            </p>
          </header>

          {/* Composer */}
          <form
            onSubmit={submit}
            className="border-y border-border bg-card/40 px-5 py-3"
            noValidate
          >
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add a todo…"
                maxLength={MAX_LEN}
                aria-invalid={!!error}
                aria-describedby={error ? "todo-error" : "todo-hint"}
                className="h-11 text-[15px]"
                enterKeyHint="done"
                autoComplete="off"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                aria-label="Add todo"
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-md bg-foreground px-3 text-background"
              >
                <Plus className="size-4" strokeWidth={2.25} />
              </motion.button>
            </div>
            <div className="mt-1.5 flex min-h-[16px] items-center justify-between text-[11px]">
              <AnimatePresence mode="wait" initial={false}>
                {error ? (
                  <motion.span
                    key="err"
                    id="todo-error"
                    role="alert"
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 text-destructive"
                  >
                    <AlertCircle className="size-3" />
                    {error}
                  </motion.span>
                ) : (
                  <motion.span
                    key="hint"
                    id="todo-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="text-muted-foreground"
                  >
                    {`${MIN_LEN}–${MAX_LEN} characters. Enter to add.`}
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className={`tabular-nums ${
                  trimmedLen > MAX_LEN
                    ? "text-destructive"
                    : nearLimit
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {trimmedLen}/{MAX_LEN}
              </span>
            </div>
          </form>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-2 py-2 [overscroll-behavior:contain]">
            {todos.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                Nothing here yet. Add your first todo above.
              </div>
            ) : (
              <ul className="flex flex-col">
                <AnimatePresence initial={false}>
                  {todos.map((t) => (
                    <motion.li
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="group flex items-start gap-3 rounded-lg px-3 py-3 active:bg-secondary sm:py-2.5 sm:hover:bg-secondary"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(t.id)}
                        aria-label={t.done ? "Mark as not done" : "Mark as done"}
                        className="-m-2 inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.done ? (
                          <CheckCircle2 className="size-5 text-[var(--accent)]" />
                        ) : (
                          <Circle className="size-5" />
                        )}
                      </button>
                      <span
                        className={`flex-1 break-words text-[15px] leading-snug ${
                          t.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {t.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTodo(t.id)}
                        aria-label="Remove todo"
                        className="-m-2 inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {completed > 0 && (
            <div className="border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                onClick={clearCompleted}
                className="h-10 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear {completed} completed
              </button>
            </div>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
