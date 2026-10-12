import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  ArrowUpRight,
  Check,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  EmailJS: one service, two templates, both fired on every send      */
/*                                                                    */
/*  .env                                                              */
/*    VITE_EMAILJS_SERVICE_ID=...                                     */
/*    VITE_EMAILJS_TEMPLATE_ID_NOTIFY=...     (lands in YOUR inbox)   */
/*    VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY=...  (thank-you to the sender)*/
/*    VITE_EMAILJS_PUBLIC_KEY=...                                     */
/*                                                                    */
/*  In EmailJS:                                                       */
/*    NOTIFY template     → To Email: your address, Reply-To: {{reply_to}} */
/*    AUTOREPLY template  → To Email: {{email}}                       */
/*  Variables sent to both: name, email, message, from_name,          */
/*  from_email, reply_to                                              */
/* ------------------------------------------------------------------ */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_NOTIFY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_NOTIFY;
const TEMPLATE_AUTOREPLY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ------------------------------------------------------------------ */
/*  Theme + data                                                       */
/* ------------------------------------------------------------------ */
const FONT_DISPLAY = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_BODY = "'Cinzel', serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const EMAIL = "punjanpandey@gmail.com";

const socials = [
  {
    label: "GitHub",
    handle: "AOISYNM",
    href: "https://github.com/AOISYNM",
    icon: Github,
  },
  {
    label: "LinkedIn",
    handle: "punjanpnd",
    href: "https://www.linkedin.com/in/punjanpnd/",
    icon: Linkedin,
  },
  {
    label: "Instagram",
    handle: "@punjan___pandey",
    href: "https://www.instagram.com/punjan___pandey/",
    icon: Instagram,
  },
];

// Highlight-style label (same as Skills / Education)
const labelHighlight =
  "inline-block border-l-2 border-[#FF3B16] bg-gradient-to-r from-[#D5220F]/20 to-transparent py-1.5 pl-3 pr-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF3B16] md:text-[11px]";

// Shared look for Input + Textarea (text-base keeps iOS from zooming on focus)
const fieldClass =
  "rounded-lg border-[#E8E5E0]/20 bg-[#050505] px-4 text-base font-bold tracking-[0.04em] text-[#E8E5E0] placeholder:font-normal placeholder:text-[#9A9692]/60 transition-colors duration-300 focus-visible:border-[#FF3B16]/60 focus-visible:ring-1 focus-visible:ring-[#FF3B16]/50 focus-visible:ring-offset-0";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const m = reduce ? 0 : 1; // 0 removes movement offsets, leaving fades only

  const [status, setStatus] = useState<Status>("idle");
  const [autoReplyOk, setAutoReplyOk] = useState(true);

  /* ---------------------------------------------------------------- */
  /*  Submit: fire BOTH templates at once                              */
  /* ---------------------------------------------------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never see or fill this field
    if (String(data.get("company") || "").trim()) {
      form.reset();
      setAutoReplyOk(true);
      setStatus("sent");
      return;
    }

    if (
      !SERVICE_ID ||
      !TEMPLATE_NOTIFY ||
      !TEMPLATE_AUTOREPLY ||
      !PUBLIC_KEY
    ) {
      toast({
        title: "Email setup missing",
        description:
          "Set the EmailJS service ID, both template IDs and the public key in your environment variables.",
        variant: "destructive",
      });
      return;
    }

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const params = {
      name,
      email,
      message,
      from_name: name,
      from_email: email,
      reply_to: email,
    };
    const options = { publicKey: PUBLIC_KEY };

    setStatus("sending");

    const [notify, reply] = await Promise.allSettled([
      emailjs.send(SERVICE_ID, TEMPLATE_NOTIFY, params, options),
      emailjs.send(SERVICE_ID, TEMPLATE_AUTOREPLY, params, options),
    ]);

    // The notification to you is what matters: if it fails, the message is lost
    if (notify.status === "rejected") {
      console.error("EmailJS notification failed:", notify.reason);
      setStatus("error");
      toast({
        title: "Failed to send",
        description: "Something went wrong while sending your message.",
        variant: "destructive",
      });
      return;
    }

    // A failed auto-reply shouldn't turn a delivered message into an error
    if (reply.status === "rejected") {
      console.warn("EmailJS auto-reply failed:", reply.reason);
    }

    setAutoReplyOk(reply.status === "fulfilled");
    form.reset();
    setStatus("sent");
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
  };

  /* ---------------------------------------------------------------- */
  /*  Motion presets                                                   */
  /* ---------------------------------------------------------------- */
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 * m },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const slideLeft: Variants = {
    hidden: { opacity: 0, x: -50 * m },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: 60 * m },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };

  const sending = status === "sending";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 md:py-32"
    >
      {/* Crimson seam separating this section from the one above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#720909] to-transparent"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* ---------- Header: centered below lg, left-aligned from lg up ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto mb-14 max-w-2xl text-center md:mb-20 lg:mx-0 lg:text-left"
        >
          <motion.h2
            id="contact-heading"
            variants={fadeUp}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            }}
            className="pb-1 font-black leading-[1.08] tracking-[0.02em]"
          >
            <span className="block text-[#E8E5E0]">Get In</span>{" "}
            {/* Padding + matching negative margin keeps the decorative swash
                from being clipped by the gradient's paint area */}
            <span className="-mx-[0.2em] -mt-[0.1em] block bg-gradient-to-b from-[#FF3B16] to-[#D5220F] bg-clip-text px-[0.2em] pb-[0.15em] pt-[0.1em] text-transparent">
              Touch
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{ fontFamily: FONT_BODY }}
            className="mt-6 text-base leading-[1.9] tracking-[0.02em] text-[#9A9692] sm:text-lg"
          >
            I'm looking for an internship or job where I can put my machine
            learning skills to work, and I'm always open to talking about new
            projects and ideas. Send me a message and I'll reply as soon as I
            can.
          </motion.p>
        </motion.div>

        {/* ---------- Info + form ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid items-start gap-14 lg:grid-cols-[1fr_520px] lg:gap-20 xl:gap-28"
        >
          {/* Info */}
          <motion.div variants={slideLeft} className="space-y-12 md:space-y-14">
            <div className="space-y-5">
              <p style={{ fontFamily: FONT_BODY }} className={labelHighlight}>
                Email
              </p>
              <div>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{ fontFamily: FONT_BODY }}
                  className="block w-fit max-w-full break-all bg-[linear-gradient(#FF3B16,#FF3B16)] bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 text-lg font-bold tracking-[0.04em] text-[#E8E5E0] transition-[background-size,color] duration-500 hover:bg-[length:100%_2px] hover:text-[#FF3B16] focus-visible:bg-[length:100%_2px] focus-visible:outline-none sm:text-2xl md:text-3xl"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <p style={{ fontFamily: FONT_BODY }} className={labelHighlight}>
                Social
              </p>
              <div className="grid gap-px overflow-hidden rounded-lg border border-[#E8E5E0]/10 bg-[#E8E5E0]/10">
                {socials.map(({ label, handle, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="group flex items-center gap-4 bg-[#0D0D0D] px-4 py-4 transition-colors duration-300 hover:bg-[#161616] focus-visible:bg-[#161616] focus-visible:outline-none sm:px-6 sm:py-5"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 text-[#FF3B16]"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        style={{ fontFamily: FONT_BODY }}
                        className="block text-sm font-bold uppercase tracking-[0.12em] text-[#E8E5E0] transition-colors duration-300 group-hover:text-[#FF3B16] md:text-base"
                      >
                        {label}
                      </span>
                      <span
                        style={{ fontFamily: FONT_BODY }}
                        className="block truncate text-xs tracking-[0.04em] text-[#9A9692]"
                      >
                        {handle}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#9A9692] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF3B16]"
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={slideRight}
            onSubmit={handleSubmit}
            onInput={() => {
              // Typing again clears a finished / failed state
              if (status === "sent" || status === "error") setStatus("idle");
            }}
            aria-label="Contact form"
            className="relative space-y-6 rounded-lg border border-[#E8E5E0]/10 bg-gradient-to-br from-[#161616] to-[#0D0D0D] p-5 sm:p-8 md:p-10"
          >
            {/* Honeypot: hidden from people, tempting to bots */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="company">Company (leave this field empty)</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="name"
                style={{ fontFamily: FONT_BODY }}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A9692]"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                maxLength={80}
                placeholder="Your name"
                required
                style={{ fontFamily: FONT_BODY }}
                className={`h-14 ${fieldClass}`}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                style={{ fontFamily: FONT_BODY }}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A9692]"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                placeholder="you@email.com"
                required
                style={{ fontFamily: FONT_BODY }}
                className={`h-14 ${fieldClass}`}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="message"
                style={{ fontFamily: FONT_BODY }}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A9692]"
              >
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                maxLength={2000}
                placeholder="Write your message..."
                required
                style={{ fontFamily: FONT_BODY }}
                className={`min-h-[9rem] resize-none py-4 ${fieldClass}`}
              />
            </div>

            <motion.div
              className="rounded-lg"
              whileHover={
                sending
                  ? undefined
                  : {
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(213,34,15,0.45)",
                    }
              }
              whileTap={sending ? undefined : { scale: 0.97 }}
              style={{ boxShadow: "0 0 0px rgba(213,34,15,0)" }}
            >
              <Button
                type="submit"
                disabled={sending}
                style={{ fontFamily: FONT_BODY }}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border-2 border-[#D5220F] bg-[#A30D0D] text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#D5220F] focus-visible:ring-2 focus-visible:ring-[#FF3B16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D] disabled:opacity-70 md:text-base"
              >
                {sending ? (
                  <>
                    <Loader2
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin motion-reduce:animate-none"
                    />
                    Sending...
                  </>
                ) : status === "sent" ? (
                  <>
                    <Check aria-hidden="true" className="h-5 w-5" />
                    Message Sent
                  </>
                ) : (
                  <>
                    Send Message
                    <Send aria-hidden="true" className="h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Inline status (screen readers announce it politely) */}
            <p
              role="status"
              aria-live="polite"
              style={{ fontFamily: FONT_BODY }}
              className="text-center text-sm leading-relaxed tracking-[0.02em] empty:hidden"
            >
              {status === "sent" && (
                <span className="text-[#E8E5E0]">
                  Thanks for reaching out. I'll get back to you soon.
                  {autoReplyOk && " A confirmation is on its way to your inbox."}
                </span>
              )}
              {status === "error" && (
                <span className="text-[#FF3B16]">
                  Something went wrong. Please try again, or email me at{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="underline underline-offset-4"
                  >
                    {EMAIL}
                  </a>
                  .
                </span>
              )}
            </p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}