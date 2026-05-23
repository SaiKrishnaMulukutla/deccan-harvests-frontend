import { CERT_RENEWAL_THRESHOLD_DAYS, PRODUCT_FORMATS, type ProductCategory } from "./constants";

/**
 * Derives a display category from a product slug.
 * Uses slug substring matching — consistent with backend naming conventions.
 */
export function deriveProductCategory(slug: string): ProductCategory {
  if (slug.includes("chilli"))   return "Chillies";
  if (slug.includes("turmeric")) return "Turmeric";
  if (slug.includes("coffee"))   return "Coffee";
  if (
    slug.includes("powder") ||
    slug.includes("spice")  ||
    slug.includes("blend")
  ) return "Spice Powders";
  return "Other" as ProductCategory;
}

/**
 * Returns the available export formats for a given product slug.
 */
export function getProductFormats(slug: string): string[] {
  if (slug.includes("chilli"))   return PRODUCT_FORMATS.chilli;
  if (slug.includes("turmeric")) return PRODUCT_FORMATS.turmeric;
  if (slug.includes("coffee"))   return PRODUCT_FORMATS.coffee;
  return PRODUCT_FORMATS.default;
}

/**
 * Formats an ISO date string for display: "15 Jun 2025".
 */
export function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

/**
 * Returns true when a cert expiry date falls within the renewal threshold window.
 * Defaults to CERT_RENEWAL_THRESHOLD_DAYS from constants.
 */
export function isExpiringWithin(
  expiresAt: string | null,
  days = CERT_RENEWAL_THRESHOLD_DAYS
): boolean {
  if (!expiresAt) return false;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < days * 24 * 60 * 60 * 1000;
}
