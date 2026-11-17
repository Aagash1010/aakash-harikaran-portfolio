import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { identity, profile } from "../../data/profile";
import { useToast } from "../../context/ToastProvider";
import { cn, isValidEmail } from "../../lib/utils";
import { Button, ButtonLink } from "../ui/Button";
import { GithubMark, LinkedinMark } from "../ui/BrandIcons";
import { Magnetic } from "../ui/Magnetic";
import { MaskLine, Reveal } from "../ui/Reveal";
import { SriLankaClock } from "../ui/SriLankaClock";

type FieldName = "name" | "email" | "subject" | "message";
type FormErrors = Partial<Record<FieldName, string>>;

const initialValues: Record<FieldName, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [draftLink, setDraftLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { notify } = useToast();
  const linkedin = profile.socials.find((social) => social.icon === "linkedin");
  const github = profile.socials.find((social) => social.icon === "github");

  const handlePointer = (event: React.PointerEvent<HTMLElement>) => {
    const element = sectionRef.current;
    if (!element || event.pointerType !== "mouse") return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      notify("Email address copied to clipboard.", "success");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      notify("Couldn't access the clipboard — select the address manually.");
    }
  };

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    setDraftLink(null);
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const next: FormErrors = {};
    if (values.name.trim().length < 2) next.name = "Please share your name.";
    if (!isValidEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.subject.trim().length < 3) next.subject = "Add a short subject.";
    if (values.message.trim().length < 10)
      next.message = "Tell me a little more — at least 10 characters.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0] as FieldName;
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
      return;
    }

    const body = `Hi Aagash,\n\n${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      values.subject.trim(),
    )}&body=${encodeURIComponent(body)}`;

    setDraftLink(mailto);
    setSubmitted(true);
    window.location.href = mailto;
    notify(
      "Email draft prepared — this site doesn't send or store form data.",
      "success",
    );
  };

  const pendingSocial = (label: string) => {
    notify(
      `${label} is not published yet — the real profile link will be added when available.`,
    );
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      onPointerMove={handlePointer}
      style={{ "--mx": "50%", "--my": "30%" } as React.CSSProperties}
      className="relative overflow-hidden border-t border-line"
    >
      {/* Interactive environment */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" />
        <div
          className="absolute inset-0 blueprint-grid opacity-60"
          style={{
            maskImage:
              "radial-gradient(circle 560px at var(--mx) var(--my), #000 0%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(circle 560px at var(--mx) var(--my), #000 0%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 620px at var(--mx) var(--my), rgba(198,255,77,0.08), transparent 68%)",
          }}
        />
        <div className="absolute -bottom-56 left-1/2 h-[34rem] w-[64rem] -translate-x-1/2 rounded-full bg-lime/[0.05] blur-[130px]" />
        <div className="absolute right-[-6rem] top-24 size-[22rem] rounded-full border border-line/50" />
        <div className="orbit-spin absolute right-[-10rem] top-10 size-[32rem] rounded-full border border-dashed border-line/30" />
        <div className="orbit-spin-reverse absolute right-8 top-[16rem] size-40 rounded-full border border-line/40" />
        <span className="absolute right-4 top-[16.5rem] size-1.5 rounded-full bg-lime" />
      </div>

      <div className="container-x relative pb-16 pt-20 md:pb-20 md:pt-28">
        <Reveal className="flex flex-wrap items-center gap-3.5" y={12}>
          <span className="mono-label text-accent">05</span>
          <span aria-hidden className="h-px w-8 bg-line sm:w-12" />
          <span className="mono-label text-muted">Contact / Final transmission</span>
          <span className="ml-auto hidden items-center gap-2 font-mono text-[7px] uppercase tracking-[0.16em] text-accent md:flex">
            <span className="relative flex size-1.5">
              <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
            </span>
            {identity.status}
          </span>
        </Reveal>

        <h2
          id="contact-heading"
          aria-label="Have a project or opportunity in mind?"
          className="mt-7 font-display font-bold uppercase leading-[0.86] tracking-[-0.058em] md:mt-10"
        >
          {identity.contact.map((line, index) => (
            <MaskLine
              key={line}
              delay={index * 0.07}
              className={cn(
                "text-[clamp(2.15rem,8vw,6.9rem)]",
                index === 1 ? "text-muted" : "text-ink",
              )}
            >
              {line === "IN MIND?" ? (
                <>
                  IN MIND<span className="text-lime">?</span>
                </>
              ) : (
                line
              )}
            </MaskLine>
          ))}
        </h2>

        <div className="mt-9 grid items-end gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-6" delay={0.05}>
            <p className="lead-copy max-w-xl">
              An internship, a collaboration, or a project worth discussing —
              the inbox is open.
            </p>
            <p className="serif-accent mt-4 max-w-md text-[clamp(1.05rem,1.7vw,1.35rem)] leading-snug text-muted">
              A conversation is usually the first prototype.
            </p>
          </Reveal>

          <Reveal
            className="flex min-w-0 flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end"
            delay={0.12}
          >
            <Magnetic strength={0.22}>
              <ButtonLink
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Portfolio enquiry")}`}
                icon={<ArrowUpRight size={15} strokeWidth={1.7} />}
                data-cursor-label="WRITE"
              >
                Email Aagash
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.16}>
              <ButtonLink
                href={profile.cv}
                download
                variant="outline"
                icon={<Download size={13} strokeWidth={1.6} />}
                iconSide="left"
              >
                Download CV
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </div>

        {/* ---------- Channels ---------- */}
        <Reveal y={18} className="mt-10 md:mt-14">
          <div className="grid border-l border-t border-line sm:grid-cols-2">
            <div className="group relative border-b border-r border-line p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                  <Mail size={11} strokeWidth={1.5} className="text-accent" aria-hidden />
                  Email
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address to clipboard"
                  className="grid size-7 place-items-center border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {copied ? (
                    <Check size={12} strokeWidth={1.8} className="text-lime" />
                  ) : (
                    <Copy size={12} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="mt-3 flex items-center justify-between gap-3"
                aria-label={`Email ${profile.name}`}
              >
                <span className="truncate font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                  {profile.email}
                </span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </a>
            </div>

            <div className="group relative border-b border-r border-line p-5">
              <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                <LinkedinMark size={11} className="text-accent" />
                LinkedIn
              </span>
              {linkedin?.href ? (
                <a
                  href={linkedin.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 flex items-center justify-between gap-3"
                  aria-label="Open LinkedIn profile"
                >
                  <span className="font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                    {linkedin.handle}
                  </span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => pendingSocial("LinkedIn")}
                  className="mt-3 flex w-full items-center justify-between gap-3 text-left"
                  aria-label="LinkedIn profile — link pending"
                >
                  <span className="font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                    Profile pending
                  </span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </button>
              )}
            </div>

            <div className="group relative border-b border-r border-line p-5">
              <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                <GithubMark size={11} className="text-accent" />
                GitHub
              </span>
              {github?.href ? (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 flex items-center justify-between gap-3"
                  aria-label="Open GitHub profile"
                >
                  <span className="font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                    {github.handle}
                  </span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => pendingSocial("GitHub")}
                  className="mt-3 flex w-full items-center justify-between gap-3 text-left"
                  aria-label="GitHub profile — link pending"
                >
                  <span className="font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                    Profile pending
                  </span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </button>
              )}
            </div>

            <div className="group relative border-b border-r border-line p-5">
              <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                <Download size={11} strokeWidth={1.5} className="text-accent" aria-hidden />
                Curriculum vitae
              </span>
              <a
                href={profile.cv}
                download
                className="mt-3 flex items-center justify-between gap-3"
              >
                <span className="font-display text-[clamp(0.95rem,1.6vw,1.2rem)] font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-accent">
                  Download PDF
                </span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  className="shrink-0 text-muted/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </Reveal>

        {/* ---------- Form ---------- */}
        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:mt-20 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-4">
            <p className="mono-label text-accent">Message / 01</p>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase leading-[0.98] tracking-[-0.04em] text-ink">
              Send a message<span className="text-lime">.</span>
            </h3>
            <p className="body-copy mt-4 max-w-sm text-[12.5px]">
              Tell me what you&apos;re building, what you&apos;re hiring for, or
              where you think we could work together.
            </p>

            <dl className="mt-7 border-t border-line">
              <div className="flex items-start justify-between gap-4 border-b border-line py-3">
                <dt className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/60">
                  Based in
                </dt>
                <dd className="flex items-center gap-1.5 text-[11.5px] text-ink">
                  <MapPin size={10} className="text-accent" aria-hidden />
                  {profile.location}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-line py-3">
                <dt className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/60">
                  Local time
                </dt>
                <dd>
                  <SriLankaClock showDate />
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-line py-3">
                <dt className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/60">
                  Status
                </dt>
                <dd className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-accent">
                  <span className="relative flex size-1.5">
                    <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                  </span>
                  Open
                </dd>
              </div>
            </dl>

            <p className="mt-4 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/45">
              {identity.coordinates} / UTC +05:30
            </p>
          </Reveal>

          <Reveal delay={0.1} y={20} className="min-w-0 lg:col-span-8">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-describedby="contact-form-note"
              className="relative border border-line bg-base/45 p-5 sm:p-7 md:p-8"
            >
              <div aria-hidden className="absolute left-0 top-0 h-px w-24 bg-lime" />

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                <span className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-muted">
                  Compose / Direct message
                </span>
                <span className="border border-line px-2.5 py-1.5 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted/60">
                  Mailto · no server
                </span>
              </div>

              <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <FormField
                  label="Name"
                  name="name"
                  placeholder="Your name"
                  value={values.name}
                  error={errors.name}
                  onChange={(value) => updateField("name", value)}
                  autoComplete="name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  error={errors.email}
                  onChange={(value) => updateField("email", value)}
                  autoComplete="email"
                />
              </div>

              <div className="mt-5">
                <FormField
                  label="Subject"
                  name="subject"
                  placeholder="What would you like to build?"
                  value={values.subject}
                  error={errors.subject}
                  onChange={(value) => updateField("subject", value)}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5">
                <FormField
                  label="Message"
                  name="message"
                  placeholder="A little context, a question, or an idea worth exploring..."
                  value={values.message}
                  error={errors.message}
                  onChange={(value) => updateField("message", value)}
                  multiline
                />
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                  id="contact-form-note"
                  className="max-w-[17rem] font-mono text-[7px] uppercase leading-relaxed tracking-[0.12em] text-muted/55"
                >
                  Submitting prepares an email draft in your own mail app. This
                  site does not send or store the data.
                </p>
                <Magnetic strength={0.16}>
                  <Button
                    type="submit"
                    className="shrink-0"
                    icon={<Send size={14} strokeWidth={1.6} />}
                  >
                    Prepare email
                  </Button>
                </Magnetic>
              </div>

              <div aria-live="polite" aria-atomic="true">
                {submitted ? (
                  <div
                    role="status"
                    className="mt-4 flex items-start gap-3 border border-lime/25 bg-lime-soft px-4 py-3"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-lime text-[#090b06]">
                      <Check size={12} strokeWidth={2} aria-hidden />
                    </span>
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-accent">
                        Draft ready
                      </p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-ink/80">
                        Your email app should open with the message prepared.
                        Nothing was sent by this website.
                      </p>
                      {draftLink ? (
                        <a
                          href={draftLink}
                          className="link-line mt-2 inline-flex font-mono text-[7px] uppercase tracking-[0.14em] text-accent"
                        >
                          Open the draft again
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}

function FormField({
  label,
  name,
  value,
  error,
  placeholder,
  type = "text",
  autoComplete,
  multiline,
  onChange,
}: FormFieldProps) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    value,
    placeholder,
    autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    className: "field peer",
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label
          htmlFor={name}
          className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted"
        >
          {label}
        </label>
        {error ? (
          <span
            id={errorId}
            role="alert"
            className="font-mono text-[6.5px] uppercase tracking-[0.12em] text-error"
          >
            {error}
          </span>
        ) : null}
      </div>
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} />
      )}
    </div>
  );
}
