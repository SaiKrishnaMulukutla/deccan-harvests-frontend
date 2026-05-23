"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { RFQ_COUNTRIES, RFQ_PRODUCTS } from "@/lib/constants";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  country:  z.string().min(1, "Please select your country"),
  product:  z.string().min(1, "Please select a product"),
  quantity: z.string().min(1, "Please enter estimated quantity"),
  message:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.65rem] tracking-[0.15em] text-white/40 uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[0.65rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "bg-transparent border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.85rem] py-2.5 transition-colors duration-200 placeholder:text-white/20";
const selectClass =
  "bg-black-rich border-b border-white/20 focus:border-gold/70 outline-none text-smoke text-[0.85rem] py-2.5 transition-colors duration-200 appearance-none cursor-pointer";

export default function RFQForm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/rfq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err?.error?.message || "Failed to submit. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-black-rich/40 backdrop-blur-sm p-8 lg:p-10"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <CheckCircle size={40} className="text-gold" strokeWidth={1} />
          <h3 className="text-2xl text-smoke font-light" style={{ fontFamily: "var(--font-playfair)" }}>
            Request Received
          </h3>
          <p className="text-[0.85rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
            We&apos;ll be in touch within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="Your Name" error={errors.name?.message}>
              <input {...register("name")} placeholder="John Smith" className={`${inputClass} w-full`} style={{ fontFamily: "var(--font-inter)" }} />
            </InputField>
            <InputField label="Email Address" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="john@company.com" className={`${inputClass} w-full`} style={{ fontFamily: "var(--font-inter)" }} />
            </InputField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="Country" error={errors.country?.message}>
              <select {...register("country")} className={`${selectClass} w-full`} style={{ fontFamily: "var(--font-inter)" }}>
                <option value="" className="bg-black-rich">Select country</option>
                {RFQ_COUNTRIES.map((c) => <option key={c} value={c} className="bg-black-rich">{c}</option>)}
              </select>
            </InputField>
            <InputField label="Product Interest" error={errors.product?.message}>
              <select {...register("product")} className={`${selectClass} w-full`} style={{ fontFamily: "var(--font-inter)" }}>
                <option value="" className="bg-black-rich">Select product</option>
                {RFQ_PRODUCTS.map((p) => <option key={p} value={p} className="bg-black-rich">{p}</option>)}
              </select>
            </InputField>
          </div>

          <InputField label="Estimated Quantity (MT / Kg)" error={errors.quantity?.message}>
            <input {...register("quantity")} placeholder="e.g. 5 MT, 500 Kg" className={`${inputClass} w-full`} style={{ fontFamily: "var(--font-inter)" }} />
          </InputField>

          <InputField label="Message (Optional)" error={errors.message?.message}>
            <textarea {...register("message")} rows={3} placeholder="Any specific requirements, packaging preferences, or questions..." className={`${inputClass} w-full resize-none`} style={{ fontFamily: "var(--font-inter)" }} />
          </InputField>

          {submitError && (
            <p className="text-[0.78rem] text-red-400 text-center -mt-2" style={{ fontFamily: "var(--font-inter)" }}>
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-center gap-2.5 w-full py-4 bg-gold text-black-deep text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {isSubmitting ? "Sending…" : (
              <>
                Send Request
                <Send size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
