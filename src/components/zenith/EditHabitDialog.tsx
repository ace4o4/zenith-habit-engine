import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useHabits, type HabitEntity } from "@/store/habits";

interface Props {
  habit: HabitEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = "lifetime" | "fixed";

export function EditHabitDialog({ habit, open, onOpenChange }: Props) {
  const updateHabit = useHabits((s) => s.updateHabit);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<Mode>("lifetime");
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      if (typeof habit.duration === "number") {
        setMode("fixed");
        setDays(habit.duration);
      } else {
        setMode("lifetime");
        setDays(30);
      }
    }
  }, [habit]);

  const save = () => {
    if (!habit) return;
    const safeTitle = title.trim();
    if (!safeTitle) return;
    updateHabit(habit.id, {
      title: safeTitle,
      duration: mode === "lifetime" ? "lifetime" : Math.max(1, Math.min(3650, days)),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit habit</DialogTitle>
          <DialogDescription>Change the title or duration.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="habit-title">Title</Label>
            <Input
              id="habit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 10 pages"
              autoFocus
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("lifetime")}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  mode === "lifetime"
                    ? "border-foreground bg-secondary text-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                Lifetime
              </button>
              <button
                type="button"
                onClick={() => setMode("fixed")}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  mode === "fixed"
                    ? "border-foreground bg-secondary text-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                Fixed quest
              </button>
            </div>
            {mode === "fixed" && (
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={3650}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value || "0", 10) || 0)}
                  className="w-28"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
