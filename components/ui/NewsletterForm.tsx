"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clientFetch, ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

type SubmitState = "idle" | "success" | "duplicate";

export default function NewsletterForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await clientFetch("/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState("success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setState("duplicate");
      } else {
        setServerError("Could not subscribe. Please try again.");
      }
    }
  };

  if (state === "success") {
    return (
      <p
        className="text-[0.78rem] text-gold/80 py-2"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        You&apos;re on the list.
      </p>
    );
  }

  if (state === "duplicate") {
    return (
      <p
        className="text-[0.78rem] text-white/40 py-2"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        You&apos;re already subscribed.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...register("email")}
          type="email"
          placeholder="your@email.com"
          className="flex-1 min-w-0 bg-transparent border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.78rem] py-2 placeholder:text-white/20 transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 text-[0.65rem] tracking-[0.12em] uppercase text-gold border-b border-gold/40 hover:border-gold pb-2 transition-colors duration-200 disabled:opacity-40"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {isSubmitting ? "…" : "Subscribe"}
        </button>
      </form>
      {(errors.email || serverError) && (
        <p
          className="text-[0.62rem] text-red-400 mt-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {errors.email?.message ?? serverError}
        </p>
      )}
    </div>
  );
}
