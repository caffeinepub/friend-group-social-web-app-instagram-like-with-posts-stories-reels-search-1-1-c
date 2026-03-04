import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  BookOpen,
  BookText,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Edit3,
  FlaskConical,
  GraduationCap,
  Heading1,
  Heading2,
  Image,
  Italic,
  LayoutDashboard,
  List,
  ListChecks,
  Microscope,
  Palette,
  Pen,
  Plus,
  Save,
  Target,
  Trash2,
  Underline,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: "Low" | "Medium" | "High";
  done: boolean;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  images: string[];
  updatedAt: string;
  createdAt: string;
}

type TabType = "dashboard" | "tasks" | "notes";
type FilterType = "All" | "Today" | string;

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Maths",
  "Biology",
  "English",
];

const SUBJECT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Physics: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-700",
  },
  Chemistry: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  Maths: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-700",
  },
  Biology: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700",
  },
  English: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-700",
  },
};

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  Physics: <FlaskConical className="w-4 h-4" />,
  Chemistry: <FlaskConical className="w-4 h-4" />,
  Maths: <Calculator className="w-4 h-4" />,
  Biology: <Microscope className="w-4 h-4" />,
  English: <BookText className="w-4 h-4" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function getSubjectColor(subject: string) {
  return (
    SUBJECT_COLORS[subject] || {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      text: "text-indigo-700 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-700",
    }
  );
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useLocalState<T>(key: string, fallback: T) {
  const [state, setStateRaw] = useState<T>(() => loadLS(key, fallback));
  const setState = useCallback(
    (val: T | ((prev: T) => T)) => {
      setStateRaw((prev) => {
        const next =
          typeof val === "function" ? (val as (p: T) => T)(prev) : val;
        saveLS(key, next);
        return next;
      });
    },
    [key],
  );
  return [state, setState] as const;
}

// ─── SubjectBadge ────────────────────────────────────────────────────────────

function SubjectBadge({ subject }: { subject: string }) {
  const c = getSubjectColor(subject);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      {SUBJECT_ICONS[subject] ?? <BookOpen className="w-3 h-3" />}
      {subject}
    </span>
  );
}

// ─── DrawingCanvas ───────────────────────────────────────────────────────────

interface DrawingCanvasProps {
  onClose: () => void;
}

function DrawingCanvas({ onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [penColor, setPenColor] = useState("#6366f1");
  const [penSize, setPenSize] = useState(3);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2 p-2 bg-muted border-b border-border flex-wrap">
        <span className="text-xs font-medium text-muted-foreground">Draw</span>
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-border"
          title="Pen color"
        />
        <div className="flex items-center gap-1">
          {[2, 4, 8].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPenSize(s)}
              className={`w-7 h-7 flex items-center justify-center rounded border ${penSize === s ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: s * 2, height: s * 2 }}
              />
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={clearCanvas}
          className="h-7 px-2 text-xs ml-auto"
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-7 w-7 p-0"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
      <canvas
        data-ocid="note.canvas_target"
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full touch-none cursor-crosshair"
        style={{ background: "transparent" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  );
}

// ─── NoteEditor ──────────────────────────────────────────────────────────────

interface NoteEditorProps {
  note: Note;
  subjects: string[];
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
}

function NoteEditor({
  note,
  subjects,
  onSave,
  onDelete,
  onBack,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [subject, setSubject] = useState(note.subject);
  const [images, setImages] = useState<string[]>(note.images);
  const [showCanvas, setShowCanvas] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on note id change
  useEffect(() => {
    setTitle(note.title);
    setSubject(note.subject);
    setImages(note.images);
    if (editorRef.current) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note.id]);

  const execCmd = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || "";
    onSave({
      ...note,
      title,
      subject,
      content,
      images,
      updatedAt: new Date().toISOString(),
    });
    toast.success("Note saved!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Note editor header */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card">
        {onBack && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onBack}
            className="h-8 w-8 p-0 shrink-0"
          >
            ←
          </Button>
        )}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="flex-1 border-0 bg-transparent text-lg font-semibold focus-visible:ring-0 px-0 h-9"
        />
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          data-ocid="note.save_button"
          size="sm"
          onClick={handleSave}
          className="h-8 gap-1.5 shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-2 border-b border-border bg-muted/50 flex-wrap">
        {[
          {
            icon: <Bold className="w-3.5 h-3.5" />,
            cmd: "bold",
            title: "Bold",
          },
          {
            icon: <Italic className="w-3.5 h-3.5" />,
            cmd: "italic",
            title: "Italic",
          },
          {
            icon: <Underline className="w-3.5 h-3.5" />,
            cmd: "underline",
            title: "Underline",
          },
        ].map((t) => (
          <button
            key={t.cmd}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd(t.cmd);
            }}
            title={t.title}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent text-foreground"
          >
            {t.icon}
          </button>
        ))}
        <Separator orientation="vertical" className="h-5 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("formatBlock", "h1");
          }}
          title="Heading 1"
          className="h-8 px-2 flex items-center gap-1 rounded hover:bg-accent text-foreground text-xs font-bold"
        >
          <Heading1 className="w-3.5 h-3.5" /> H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("formatBlock", "h2");
          }}
          title="Heading 2"
          className="h-8 px-2 flex items-center gap-1 rounded hover:bg-accent text-foreground text-xs font-semibold"
        >
          <Heading2 className="w-3.5 h-3.5" /> H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("insertUnorderedList");
          }}
          title="Bullet List"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent text-foreground"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <Separator orientation="vertical" className="h-5 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="note.upload_button"
          title="Upload Image"
          className="h-8 px-2 flex items-center gap-1 rounded hover:bg-accent text-foreground text-xs"
        >
          <Image className="w-3.5 h-3.5" /> Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => setShowCanvas((v) => !v)}
          title="Toggle Drawing"
          className={`h-8 px-2 flex items-center gap-1 rounded text-xs ${showCanvas ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}`}
        >
          <Pen className="w-3.5 h-3.5" /> Draw
        </button>
        <div className="ml-auto">
          <Button
            data-ocid="note.delete_button.1"
            size="sm"
            variant="ghost"
            onClick={() => onDelete(note.id)}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Rich text editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-ocid="note.editor"
            className="min-h-48 outline-none text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none focus:outline-none"
            style={{ direction: "ltr" }}
            onInput={() => {}}
          />

          {/* Drawing canvas */}
          <AnimatePresence>
            {showCanvas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DrawingCanvas onClose={() => setShowCanvas(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Images */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Attached Images
              </p>
              <div className="grid grid-cols-2 gap-2">
                {images.map((src, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional image keys
                    key={i}
                    className="relative group rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={src}
                      alt={`Uploaded note attachment ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

interface DashboardTabProps {
  tasks: Task[];
  notes: Note[];
  subjects: string[];
  dailyTarget: number;
  onSetTarget: (n: number) => void;
  onTaskToggle: (id: string) => void;
}

function DashboardTab({
  tasks,
  notes,
  dailyTarget,
  subjects,
  onSetTarget,
  onTaskToggle,
}: DashboardTabProps) {
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [targetInput, setTargetInput] = useState(String(dailyTarget));

  const today = todayStr();
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const completedToday = todayTasks.filter((t) => t.done).length;
  const progressPct =
    dailyTarget > 0
      ? Math.min(100, Math.round((completedToday / dailyTarget) * 100))
      : 0;

  const allSubjects = [
    ...new Set([
      ...DEFAULT_SUBJECTS,
      ...subjects.filter((s) => !DEFAULT_SUBJECTS.includes(s)),
    ]),
  ];

  return (
    <div className="p-4 space-y-5 pb-6">
      {/* Daily Target Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-white shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-indigo-200 text-sm font-medium">
              Daily Progress
            </p>
            <p className="text-3xl font-bold mt-0.5">
              {completedToday}
              <span className="text-indigo-300 text-xl"> / {dailyTarget}</span>
            </p>
            <p className="text-indigo-200 text-sm">tasks completed today</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-xl p-2.5">
              <Target className="w-5 h-5" />
            </div>
            <Button
              data-ocid="daily_target.save_button"
              size="sm"
              variant="ghost"
              onClick={() => setShowTargetEdit((v) => !v)}
              className="bg-white/20 hover:bg-white/30 text-white h-8 px-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        {showTargetEdit && (
          <div className="flex gap-2 mt-3">
            <Input
              data-ocid="daily_target.input"
              type="number"
              min="1"
              max="50"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="h-8 bg-white/20 border-white/30 text-white placeholder:text-indigo-300 w-24"
              placeholder="Tasks"
            />
            <Button
              size="sm"
              className="bg-white text-indigo-600 hover:bg-indigo-50 h-8"
              onClick={() => {
                const n = Number.parseInt(targetInput);
                if (n > 0) {
                  onSetTarget(n);
                  setShowTargetEdit(false);
                  toast.success(`Daily target set to ${n}`);
                }
              }}
            >
              Set
            </Button>
          </div>
        )}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-indigo-200 mb-1.5">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Subject Cards */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Subject Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allSubjects.map((subject, i) => {
            const c = getSubjectColor(subject);
            const subjectNotes = notes.filter(
              (n) => n.subject === subject,
            ).length;
            const subjectPending = tasks.filter(
              (t) => t.subject === subject && !t.done,
            ).length;
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-3 ${c.bg} ${c.border}`}
              >
                <div
                  className={`flex items-center gap-1.5 font-semibold text-sm mb-2 ${c.text}`}
                >
                  {SUBJECT_ICONS[subject] ?? <BookOpen className="w-4 h-4" />}
                  <span className="truncate">{subject}</span>
                </div>
                <div className="space-y-0.5">
                  <div className={`text-xs ${c.text} opacity-80`}>
                    <span className="font-medium">{subjectNotes}</span> notes
                  </div>
                  <div className={`text-xs ${c.text} opacity-80`}>
                    <span className="font-medium">{subjectPending}</span>{" "}
                    pending tasks
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <ListChecks className="w-4 h-4" /> Today's Tasks
        </h3>
        {todayTasks.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="text-center py-8 text-muted-foreground"
          >
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tasks scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border bg-card ${task.done ? "opacity-60" : ""}`}
              >
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${task.done ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <SubjectBadge subject={task.subject} />
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

interface TasksTabProps {
  tasks: Task[];
  subjects: string[];
  dailyTarget: number;
  onAdd: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetTarget: (n: number) => void;
  filterSubject: string | null;
}

function TasksTab({
  tasks,
  subjects,
  dailyTarget,
  onAdd,
  onToggle,
  onDelete,
  onSetTarget,
  filterSubject,
}: TasksTabProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(
    filterSubject || subjects[0] || "Physics",
  );
  const [dueDate, setDueDate] = useState(todayStr());
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [filter, setFilter] = useState<FilterType>("All");
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [targetInput, setTargetInput] = useState(String(dailyTarget));

  useEffect(() => {
    if (filterSubject) {
      setSubject(filterSubject);
      setFilter(filterSubject);
    }
  }, [filterSubject]);

  const handleAdd = () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      subject,
      dueDate,
      dueTime,
      priority,
      done: false,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    toast.success("Task added!");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Today") return t.dueDate === todayStr();
    if (filter !== "All") return t.subject === filter;
    return true;
  });

  const allSubjects = [
    ...new Set([
      ...DEFAULT_SUBJECTS,
      ...subjects.filter((s) => !DEFAULT_SUBJECTS.includes(s)),
    ]),
  ];
  const today = todayStr();
  const completedToday = tasks.filter(
    (t) => t.dueDate === today && t.done,
  ).length;

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Daily target bar */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
        <Target className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            Today's Goal:{" "}
            <span className="text-primary">{dailyTarget} tasks</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {completedToday} / {dailyTarget} done
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowTargetEdit((v) => !v)}
          className="h-8 w-8 p-0 shrink-0"
          data-ocid="daily_target.save_button"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <AnimatePresence>
        {showTargetEdit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <Input
              data-ocid="daily_target.input"
              type="number"
              min="1"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Set target"
              className="h-8 w-28"
            />
            <Button
              size="sm"
              onClick={() => {
                const n = Number.parseInt(targetInput);
                if (n > 0) {
                  onSetTarget(n);
                  setShowTargetEdit(false);
                  toast.success(`Target: ${n} tasks`);
                }
              }}
              className="h-8"
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add task form */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </h3>
        <Input
          data-ocid="task.input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="h-10"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <div className="grid grid-cols-2 gap-2">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {allSubjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as "Low" | "Medium" | "High")}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 pl-8 text-sm"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>
        <Button
          data-ocid="task.add_button"
          className="w-full h-10 gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(["All", "Today", ...allSubjects] as FilterType[]).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid="tasks.tab"
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div
          data-ocid="tasks.empty_state"
          className="text-center py-10 text-muted-foreground"
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No tasks found</p>
          <p className="text-xs">Add a task above to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.03 }}
                data-ocid={`task.item.${i + 1}`}
                className={`flex items-start gap-3 p-3.5 rounded-xl border bg-card transition-opacity ${task.done ? "opacity-60" : ""}`}
              >
                <Checkbox
                  data-ocid={`task.checkbox.${i + 1}`}
                  checked={task.done}
                  onCheckedChange={() => onToggle(task.id)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <SubjectBadge subject={task.subject} />
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                        {task.dueTime && ` ${task.dueTime}`}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  data-ocid={`task.delete_button.${i + 1}`}
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

interface NotesTabProps {
  notes: Note[];
  subjects: string[];
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  filterSubject: string | null;
}

function NotesTab({
  notes,
  subjects,
  onSave,
  onDelete,
  filterSubject,
}: NotesTabProps) {
  const allSubjects = [
    ...new Set([
      ...DEFAULT_SUBJECTS,
      ...subjects.filter((s) => !DEFAULT_SUBJECTS.includes(s)),
    ]),
  ];
  const [selectedId, setSelectedId] = useState<string | null>(
    notes[0]?.id ?? null,
  );
  const [showEditor, setShowEditor] = useState(false);

  const filteredNotes = filterSubject
    ? notes.filter((n) => n.subject === filterSubject)
    : notes;

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      subject: filterSubject || allSubjects[0] || "Physics",
      content: "",
      images: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    onSave(newNote);
    setSelectedId(newNote.id);
    setShowEditor(true);
  };

  const selectedNote = notes.find((n) => n.id === selectedId);

  const handleDelete = (id: string) => {
    onDelete(id);
    if (selectedId === id) {
      const remaining = filteredNotes.filter((n) => n.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
      setShowEditor(false);
    }
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Note list — hidden on mobile when editing */}
      <div
        className={`${showEditor ? "hidden md:flex" : "flex"} flex-col w-full md:w-64 lg:w-72 border-r border-border bg-sidebar shrink-0`}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Notes</h3>
          <Button
            data-ocid="note.add_button"
            size="sm"
            onClick={createNote}
            className="h-8 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {filteredNotes.length === 0 ? (
            <div
              data-ocid="notes.empty_state"
              className="text-center py-10 text-muted-foreground px-4"
            >
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Create your first note</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredNotes.map((note, i) => (
                <button
                  key={note.id}
                  type="button"
                  data-ocid={`note.item.${i + 1}`}
                  onClick={() => {
                    setSelectedId(note.id);
                    setShowEditor(true);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selectedId === note.id ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <p className="text-sm font-medium truncate">
                    {note.title || "Untitled"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <SubjectBadge subject={note.subject} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(note.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Note editor */}
      <div
        className={`${showEditor ? "flex" : "hidden md:flex"} flex-1 flex-col min-h-0 min-w-0`}
      >
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            subjects={allSubjects}
            onSave={onSave}
            onDelete={handleDelete}
            onBack={() => setShowEditor(false)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Select a note or create one</p>
              <Button
                data-ocid="note.add_button"
                size="sm"
                onClick={createNote}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main StudyToolsPage ──────────────────────────────────────────────────────

export default function StudyToolsPage() {
  const [tasks, setTasks] = useLocalState<Task[]>("iit_tasks", []);
  const [notes, setNotes] = useLocalState<Note[]>("iit_notes", []);
  const [customSubjects, setCustomSubjects] = useLocalState<string[]>(
    "iit_custom_subjects",
    [],
  );
  const [dailyTarget, setDailyTarget] = useLocalState<number>(
    "iit_daily_target",
    5,
  );
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allSubjects = [...DEFAULT_SUBJECTS, ...customSubjects];

  // Task operations
  const addTask = (task: Task) => setTasks((prev) => [task, ...prev]);
  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  // Note operations
  const saveNote = (note: Note) =>
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === note.id);
      return exists
        ? prev.map((n) => (n.id === note.id ? note : n))
        : [note, ...prev];
    });
  const deleteNote = (id: string) =>
    setNotes((prev) => prev.filter((n) => n.id !== id));

  // Subject operations
  const addSubject = () => {
    const s = newSubject.trim();
    if (!s) return;
    if (allSubjects.includes(s)) {
      toast.error("Subject already exists");
      return;
    }
    setCustomSubjects((prev) => [...prev, s]);
    setNewSubject("");
    toast.success(`Subject "${s}" added`);
  };
  const deleteSubject = (s: string) => {
    setCustomSubjects((prev) => prev.filter((x) => x !== s));
    if (filterSubject === s) setFilterSubject(null);
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-background">
      {/* Subject Sidebar — Overlay on mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed md:relative z-50 md:z-auto top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm text-sidebar-foreground">
                IIT Study
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Organize by subject</p>
        </div>

        {/* Subject list */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setFilterSubject(null);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filterSubject === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              All Subjects
            </button>

            <div className="mt-3 mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">
                Subjects
              </p>
            </div>

            {allSubjects.map((subject) => {
              const c = getSubjectColor(subject);
              const isCustom = !DEFAULT_SUBJECTS.includes(subject);
              return (
                <div
                  key={subject}
                  className={`flex items-center gap-1 rounded-lg transition-colors ${
                    filterSubject === subject
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-accent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFilterSubject(subject);
                      setSidebarOpen(false);
                    }}
                    className={`flex-1 text-left px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                      filterSubject === subject
                        ? "text-primary-foreground"
                        : `${c.text}`
                    }`}
                  >
                    {SUBJECT_ICONS[subject] ?? <BookOpen className="w-4 h-4" />}
                    {subject}
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteSubject(subject)}
                      className="w-6 h-6 flex items-center justify-center rounded mr-1 hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Add subject */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex gap-2">
            <Input
              data-ocid="subject.input"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="New subject..."
              className="h-8 text-xs flex-1"
              onKeyDown={(e) => e.key === "Enter" && addSubject()}
            />
            <Button
              data-ocid="subject.add_button"
              size="sm"
              onClick={addSubject}
              className="h-8 w-8 p-0 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top bar with tab navigation */}
        <div className="border-b border-border bg-card px-3 py-2 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent border border-border"
          >
            <GraduationCap className="w-4 h-4" />
          </button>

          {filterSubject && (
            <div className="hidden md:flex items-center gap-1.5">
              <SubjectBadge subject={filterSubject} />
              <button
                type="button"
                onClick={() => setFilterSubject(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-1 flex-1 justify-center md:justify-start">
            {[
              {
                id: "dashboard" as TabType,
                label: "Dashboard",
                icon: <LayoutDashboard className="w-4 h-4" />,
                ocid: "dashboard.tab",
              },
              {
                id: "tasks" as TabType,
                label: "Tasks",
                icon: <ListChecks className="w-4 h-4" />,
                ocid: "tasks.tab",
              },
              {
                id: "notes" as TabType,
                label: "Notes",
                icon: <BookOpen className="w-4 h-4" />,
                ocid: "notes.tab",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={tab.ocid}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto"
              >
                <DashboardTab
                  tasks={tasks}
                  notes={notes}
                  subjects={allSubjects}
                  dailyTarget={dailyTarget}
                  onSetTarget={setDailyTarget}
                  onTaskToggle={toggleTask}
                />
              </motion.div>
            )}
            {activeTab === "tasks" && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto"
              >
                <TasksTab
                  tasks={tasks}
                  subjects={allSubjects}
                  dailyTarget={dailyTarget}
                  onAdd={addTask}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onSetTarget={setDailyTarget}
                  filterSubject={filterSubject}
                />
              </motion.div>
            )}
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <NotesTab
                  notes={notes}
                  subjects={allSubjects}
                  onSave={saveNote}
                  onDelete={deleteNote}
                  filterSubject={filterSubject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
