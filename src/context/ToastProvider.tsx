import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { cn } from "../lib/utils";

type ToastTone = "default" | "success";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const reduced = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "default") => {
      const id = (counter.current += 1);
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4600);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-5 right-5 z-[220] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2 sm:bottom-8 sm:right-8"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass pointer-events-auto flex items-start gap-3 rounded-md px-4 py-3.5 shadow-2xl"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                  toast.tone === "success"
                    ? "bg-lime text-[#090b06]"
                    : "border border-line text-accent",
                )}
              >
                {toast.tone === "success" ? <Check size={12} /> : <Info size={12} />}
              </span>
              <p className="flex-1 text-[13px] leading-relaxed text-ink">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="mt-0.5 text-muted transition-colors hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
