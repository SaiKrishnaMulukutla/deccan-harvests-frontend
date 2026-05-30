"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clientFetch, ApiError } from "@/lib/api";
import { Radio } from "lucide-react";

const schema = z.object({
  subject:  z.string().min(5, "Subject must be at least 5 characters"),
  bodyHtml: z.string().min(20, "Body must be at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

type Step = "compose" | "confirm" | "sent";

export default function BroadcastPage() {
  const [step, setStep] = useState<Step>("compose");
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onPreview = (data: FormData) => {
    setPendingData(data);
    setStep("confirm");
  };

  const onConfirm = async () => {
    if (!pendingData) return;
    setSending(true);
    setServerError(null);
    try {
      await clientFetch("/api/v1/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingData),
      });
      setStep("sent");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Broadcast failed. Please try again.");
      setStep("compose");
    } finally {
      setSending(false);
    }
  };

  if (step === "sent") {
    return (
      <div className="max-w-xl">
        <div className="flex flex-col items-center text-center py-16 gap-4">
          <Radio size={32} className="text-gold" strokeWidth={1} />
          <h2 className="text-[1.4rem] font-light text-smoke" style={{ fontFamily: "var(--font-playfair)" }}>
            Broadcast Sent
          </h2>
          <p className="text-[0.82rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
            Your message has been queued for all active subscribers.
          </p>
          <button
            onClick={() => { setStep("compose"); setPendingData(null); }}
            className="mt-4 px-6 py-2.5 border border-white/20 text-[0.72rem] text-white/50 hover:border-white/40 hover:text-white/80 uppercase tracking-[0.1em] transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm" && pendingData) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-[1.4rem] font-normal text-smoke mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Confirm Broadcast
        </h1>
        <p className="text-[0.8rem] text-white/40 mb-8" style={{ fontFamily: "var(--font-inter)" }}>
          This will send to all active subscribers. This action cannot be undone.
        </p>

        <div className="border border-white/8 p-5 mb-6 space-y-4">
          <div>
            <p className="text-[0.6rem] tracking-[0.15em] text-white/25 uppercase mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Subject</p>
            <p className="text-[0.88rem] text-smoke" style={{ fontFamily: "var(--font-inter)" }}>{pendingData.subject}</p>
          </div>
          <div>
            <p className="text-[0.6rem] tracking-[0.15em] text-white/25 uppercase mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Body</p>
            <div
              className="text-[0.82rem] text-white/60 leading-relaxed border border-white/6 p-3 bg-black-rich"
              style={{ fontFamily: "var(--font-inter)" }}
              dangerouslySetInnerHTML={{ __html: pendingData.bodyHtml }}
            />
          </div>
        </div>

        {serverError && (
          <p className="text-[0.75rem] text-red-400 mb-4" style={{ fontFamily: "var(--font-inter)" }}>{serverError}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={sending}
            className="px-6 py-3 bg-gold text-black-deep text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {sending ? "Sending…" : "Confirm & Send"}
          </button>
          <button
            onClick={() => setStep("compose")}
            disabled={sending}
            className="px-6 py-3 border border-white/20 text-[0.72rem] text-white/50 hover:border-white/40 hover:text-white/80 uppercase tracking-[0.1em] transition-colors disabled:opacity-50"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[1.4rem] font-normal text-smoke mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
        Broadcast Email
      </h1>
      <p className="text-[0.8rem] text-white/40 mb-8" style={{ fontFamily: "var(--font-inter)" }}>
        Send a message to all active subscribers. You will review before sending.
      </p>

      <form onSubmit={handleSubmit(onPreview)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.62rem] tracking-[0.15em] text-white/35 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Subject
          </label>
          <input
            {...register("subject")}
            placeholder="e.g. New Teja Chilli Harvest — 2026 Season Now Available"
            className="bg-transparent border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.88rem] py-2.5 transition-colors placeholder:text-white/15"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          {errors.subject && (
            <p className="text-[0.65rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{errors.subject.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.62rem] tracking-[0.15em] text-white/35 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Body (HTML)
          </label>
          <textarea
            {...register("bodyHtml")}
            rows={10}
            placeholder="<p>Dear partner,</p><p>We are excited to announce...</p>"
            className="bg-black-rich border border-white/10 focus:border-gold/40 outline-none text-smoke text-[0.82rem] p-3 transition-colors placeholder:text-white/15 resize-y font-mono"
          />
          {errors.bodyHtml && (
            <p className="text-[0.65rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>{errors.bodyHtml.message}</p>
          )}
          <p className="text-[0.62rem] text-white/20" style={{ fontFamily: "var(--font-inter)" }}>
            Accepts raw HTML. Brevo wraps it in the standard email layout automatically.
          </p>
        </div>

        <button
          type="submit"
          className="self-start px-6 py-3 bg-gold text-black-deep text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-gold-light transition-colors"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Preview →
        </button>
      </form>
    </div>
  );
}
