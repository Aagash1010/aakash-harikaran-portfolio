import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, Terminal } from "lucide-react";
import {
  education,
  profile,
  projects,
  skillCategories,
  timeline,
} from "../../data/profile";
import { cn } from "../../lib/utils";

type LineKind = "input" | "output" | "muted" | "error";

interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

const suggestions = ["whoami", "projects", "skills", "contact"];

function skillSummary() {
  return skillCategories
    .map(
      (category) =>
        `${category.label}\n  ${category.skills.map((skill) => skill.name).join(", ")}`,
    )
    .join("\n");
}

function projectSummary() {
  return projects
    .map(
      (project) =>
        `${project.index}  ${project.title}\n    /work/${project.id}`,
    )
    .join("\n");
}

const internship = timeline.find((item) => item.type === "Internship");

function runCommand(command: string): { text: string; kind: LineKind } {
  switch (command) {
    case "help":
      return {
        kind: "output",
        text: [
          "Available commands:",
          "  whoami       identity and current focus",
          "  education    degree and institution",
          "  skills       technologies by area",
          "  projects     the four documented builds",
          "  internship   professional experience",
          "  contact      email and profile links",
          "  cv           curriculum vitae location",
          "  clear        clear the terminal",
        ].join("\n"),
      };
    case "whoami":
      return {
        kind: "output",
        text: [
          profile.name,
          profile.roleLine,
          `${profile.degreeShort} / ${profile.specialization}`,
          `${profile.university} · ${profile.location}`,
          profile.availability.label,
        ].join("\n"),
      };
    case "education":
      return {
        kind: "output",
        text: [
          education.degree,
          `Specialization: ${education.specialization}`,
          education.fullName,
          `${education.location} · ${education.status}`,
        ].join("\n"),
      };
    case "skills":
      return { kind: "output", text: skillSummary() };
    case "projects":
      return { kind: "output", text: projectSummary() };
    case "internship":
      return {
        kind: "output",
        text: internship
          ? [
              `${internship.role} — ${internship.org}`,
              internship.period,
              internship.summary,
            ].join("\n")
          : "No internship entry is currently documented.",
      };
    case "contact": {
      const linkedin = profile.socials.find((social) => social.icon === "linkedin");
      const github = profile.socials.find((social) => social.icon === "github");
      return {
        kind: "output",
        text: [
          `Email     ${profile.email}`,
          `LinkedIn  ${linkedin?.href ?? "link pending"}`,
          `GitHub    ${github?.href ?? "link pending"}`,
          `Location  ${profile.location}`,
        ].join("\n"),
      };
    }
    case "cv":
      return {
        kind: "output",
        text: `Curriculum vitae: ${profile.cv}\nUse any “Download CV” button, or open the path above.`,
      };
    default:
      return {
        kind: "error",
        text: `command not found: ${command}\nType "help" to list available commands.`,
      };
  }
}

let lineId = 0;

export function DeveloperTerminal() {
  const [lines, setLines] = useState<Line[]>([
    {
      id: (lineId += 1),
      kind: "muted",
      text: "Portfolio shell — a small, real interface. Type \"help\" to list commands.",
    },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  const submit = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
      setValue("");
      setHistory((current) => [command, ...current].slice(0, 30));
      setHistoryIndex(-1);
      return;
    }

    const result = runCommand(command);
    setLines((current) => [
      ...current.slice(-40),
      { id: (lineId += 1), kind: "input", text: command },
      { id: (lineId += 1), kind: result.kind, text: result.text },
    ]);
    setHistory((current) => [command, ...current].slice(0, 30));
    setHistoryIndex(-1);
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setValue("");
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setValue(history[next]);
    }
  };

  return (
    <div className="relative overflow-hidden border border-line bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.06]" />

      <div className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-[#0f0f0f] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ff6b5e]/70" />
            <span className="size-2 rounded-full bg-[#ffd166]/70" />
            <span className="size-2 rounded-full bg-[#c6ff4d]/70" />
          </span>
          <span className="flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.2em] text-[#858585]">
            <Terminal size={11} strokeWidth={1.5} aria-hidden />
            aagash@portfolio: ~
          </span>
        </div>
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#858585]/70">
          Local / no server
        </span>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="relative h-[19rem] overflow-y-auto px-4 py-4 font-mono text-[11.5px] leading-relaxed sm:h-[21rem] sm:px-5"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.kind === "input" ? (
              <span>
                <span className="text-[#c6ff4d]">guest@ak</span>
                <span className="text-[#858585]">:~$</span>{" "}
                <span className="text-[#f5f5f5]">{line.text}</span>
              </span>
            ) : (
              <span
                className={cn(
                  line.kind === "muted" && "text-[#858585]",
                  line.kind === "output" && "text-[#d7d7d7]",
                  line.kind === "error" && "text-[#ff9a8c]",
                )}
              >
                {line.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="relative flex items-center gap-2 border-t border-white/10 bg-[#0f0f0f] px-4 py-2.5"
      >
        <span aria-hidden className="shrink-0 font-mono text-[11px] text-[#c6ff4d]">
          guest@ak
          <span className="text-[#858585]">:~$</span>
        </span>
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command
        </label>
        <input
          id="terminal-input"
          name="terminal-command"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="type a command"
          className="min-w-0 flex-1 bg-transparent text-[16px] text-[#f5f5f5] outline-none placeholder:text-[#5a5a5a] sm:text-[11.5px]"
        />
        <button
          type="submit"
          aria-label="Run terminal command"
          className="grid size-8 shrink-0 place-items-center border border-white/15 text-[#858585] transition-colors hover:border-[#c6ff4d]/50 hover:text-[#c6ff4d]"
        >
          <CornerDownLeft size={13} strokeWidth={1.6} />
        </button>
      </form>

      <div className="relative flex flex-wrap items-center gap-1.5 border-t border-white/10 bg-[#0d0d0d] px-4 py-2.5">
        <span className="mr-1 font-mono text-[6.5px] uppercase tracking-[0.16em] text-[#858585]/70">
          Try
        </span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => submit(suggestion)}
            className="border border-white/10 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-[#858585] transition-colors hover:border-[#c6ff4d]/40 hover:text-[#c6ff4d]"
          >
            {suggestion}
          </button>
        ))}
        <span className="ml-auto hidden font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#858585]/60 sm:block">
          ↑ ↓ history
        </span>
      </div>
    </div>
  );
}
