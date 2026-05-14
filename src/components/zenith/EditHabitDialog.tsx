import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { dateStr } from "@/lib/date";
import { useHabits, validateHabit, type HabitEntity } from "@/store/habits";

interface Props {
  habit: HabitEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = "lifetime" | "fixed" | "range";

export function EditHabitDialog({ habit, open, onOpenChange }: Props) {
  const updateHabit = useHabits((s) => s.updateHabit);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<Mode>("lifetime");
  const [days, setDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!habit) return;
    setTitle(habit.title);
    setErrors({});
    if (habit.startDate && habit.endDate) {
      setMode("range");
      setStartDate(new Date(habit.startDate + "T00:00:00"));
      setEndDate(new Date(habit.endDate + "T00:00:00"));
      setDays(30);
    } else if (typeof habit.duration === "number") {
      setMode("fixed");
      setDays(habit.duration);
      setStartDate(undefined);
      setEndDate(undefined);
    } else {
      setMode("lifetime");
      setDays(30);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [habit]);

  const save = () => {
    if (!habit) return;
    const result = validateHabit({
      title,
      mode,
      days,
      startDate: startDate ? dateStr(startDate) : undefined,
      endDate: endDate ? dateStr(endDate) : undefined,
    });
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    if (mode === "lifetime") {
      updateHabit(habit.id, {
        title,
        duration: "lifetime",
        startDate: null,
        endDate: null,
      });
    } else if (mode === "fixed") {
      updateHabit(habit.id, {
        title,
        duration: days,
        startDate: null,
        endDate: null,
      });
    } else {
      updateHabit(habit.id, {
        title,
        duration: "lifetime",
        startDate: dateStr(startDate!),
        endDate: dateStr(endDate!),
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit habit</DialogTitle>
          <DialogDescription>Adjust the title, duration, or active window.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="habit-title">Title</Label>
            <Input
              id="habit-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="e.g. Read 10 pages"
              maxLength={80}
              aria-invalid={!!errors.title}
              autoFocus
            />
            <FieldError msg={errors.title} />
            <p className="text-[11px] text-muted-foreground">{title.trim().length}/80</p>
          </div>

          {/* Mode */}
          <div className="grid gap-1.5">
            <Label>How long will you practice?</Label>
            <div className="grid grid-cols-3 gap-2">
              <ModeButton active={mode === "lifetime"} onClick={() => setMode("lifetime")}>
                Lifetime
              </ModeButton>
              <ModeButton active={mode === "fixed"} onClick={() => setMode("fixed")}>
                For N days
              </ModeButton>
              <ModeButton active={mode === "range"} onClick={() => setMode("range")}>
                Date range
              </ModeButton>
            </div>
          </div>

          {/* Fixed days */}
          {mode === "fixed" && (
            <div className="grid gap-1.5">
              <Label htmlFor="habit-days">Number of days</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="habit-days"
                  type="number"
                  min={1}
                  max={3650}
                  step={1}
                  value={Number.isFinite(days) ? days : ""}
                  onChange={(e) => {
                    setDays(parseInt(e.target.value || "0", 10));
                    if (errors.days) setErrors({ ...errors, days: "" });
                  }}
                  className="w-32"
                  aria-invalid={!!errors.days}
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <FieldError msg={errors.days} />
            </div>
          )}

          {/* Date range */}
          {mode === "range" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Start</Label>
                <DatePopover
                  date={startDate}
                  onChange={(d) => {
                    setStartDate(d);
                    if (errors.startDate) setErrors({ ...errors, startDate: "" });
                  }}
                />
                <FieldError msg={errors.startDate} />
              </div>
              <div className="grid gap-1.5">
                <Label>End</Label>
                <DatePopover
                  date={endDate}
                  onChange={(d) => {
                    setEndDate(d);
                    if (errors.endDate) setErrors({ ...errors, endDate: "" });
                  }}
                  disabled={(d) => (startDate ? d < startDate : false)}
                />
                <FieldError msg={errors.endDate} />
              </div>
            </div>
          )}
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

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-[13px] transition-colors",
        active
          ? "border-foreground bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}

function DatePopover({
  date,
  onChange,
  disabled,
}: {
  date?: Date;
  onChange: (d: Date | undefined) => void;
  disabled?: (d: Date) => boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          disabled={disabled}
          className={cn("pointer-events-auto p-3")}
        />
      </PopoverContent>
    </Popover>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="inline-flex items-center gap-1 text-[12px] text-destructive" role="alert">
      <AlertCircle className="size-3.5" />
      {msg}
    </p>
  );
}
