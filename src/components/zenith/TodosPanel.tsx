import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/store/todos";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function TodosPanel({ open, onOpenChange }: Props) {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted, hydrated, setHydrated } =
    useTodos();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && !hydrated) {
      useTodos.persist.rehydrate()?.then(() => setHydrated(true));
    }
  }, [open, hydrated, setHydrated]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = draft.trim();
    if (!t) {
      setError("Type something to add.");
      return;
    }
    if (t.length > 200) {
      setError("Keep it under 200 characters.");
      return;
    }
    addTodo(t);
    setDraft("");
    setError("");
  };

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full bg-background p-0 sm:max-w-md sm:w-[420px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-5 text-left">
            <SheetTitle>Todos</SheetTitle>
            <SheetDescription>
              {todos.length === 0
                ? "Capture your immediate next steps."
                : `${remaining} open · ${completed} done`}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={submit} className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Add a todo…"
                maxLength={200}
                aria-invalid={!!error}
              />
              <Button type="submit" size="icon" aria-label="Add todo">
                <Plus className="size-4" />
              </Button>
            </div>
            {error && (
              <p className="mt-1.5 text-[12px] text-destructive" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="flex-1 overflow-y-auto p-3">
            {todos.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                Nothing here yet. Add your first todo above.
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                <AnimatePresence initial={false}>
                  {todos.map((t) => (
                    <motion.li
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="group flex items-start gap-2 rounded-md px-2 py-2 hover:bg-secondary"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(t.id)}
                        aria-label={t.done ? "Mark as not done" : "Mark as done"}
                        className="mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t.done ? (
                          <CheckCircle2 className="size-4 text-[var(--accent)]" />
                        ) : (
                          <Circle className="size-4" />
                        )}
                      </button>
                      <span
                        className={`flex-1 break-words text-[14px] leading-snug ${
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
                        className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {completed > 0 && (
            <div className="border-t border-border px-5 py-3">
              <button
                onClick={clearCompleted}
                className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear {completed} completed
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
