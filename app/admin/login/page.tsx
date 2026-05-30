"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clientFetch, ApiError } from "@/lib/api";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await clientFetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.push("/admin/rfq");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setServerError("Invalid email or password.");
      } else if (err instanceof ApiError && err.status === 429) {
        setServerError("Too many login attempts. Try again later.");
      } else {
        setServerError("Could not connect. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-[0.62rem] tracking-[0.2em] text-white/30 uppercase mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Deccan Harvests
          </p>
          <h1
            className="text-[1.8rem] font-light text-smoke"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin Portal
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[0.62rem] tracking-[0.15em] text-white/35 uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="bg-transparent border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.88rem] py-2.5 transition-colors placeholder:text-white/15"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            {errors.email && (
              <p className="text-[0.65rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[0.62rem] tracking-[0.15em] text-white/35 uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="bg-transparent border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.88rem] py-2.5 transition-colors placeholder:text-white/15"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            {errors.password && (
              <p className="text-[0.65rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p
              className="text-[0.75rem] text-red-400 -mt-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 py-3.5 bg-gold text-black-deep text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-all hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
