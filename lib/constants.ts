// ── RFQ Form ────────────────────────────────────────────────────────────────

export const RFQ_COUNTRIES = [
  "United States", "United Kingdom", "Germany", "Netherlands", "France",
  "Italy", "Spain", "United Arab Emirates", "Saudi Arabia", "Qatar",
  "Kuwait", "Bahrain", "Oman", "Singapore", "Malaysia", "Indonesia",
  "Thailand", "Vietnam", "Japan", "South Korea", "China", "Australia",
  "New Zealand", "Canada", "Brazil", "South Africa", "Other",
] as const;

export const RFQ_PRODUCTS = [
  "Teja Chilli (S17)",
  "Byadgi Chilli",
  "Kashmiri Chilli",
  "Guntur Sannam",
  "Turmeric (Finger/Powder)",
  "Coffee Beans (Arabica)",
  "Coffee Beans (Robusta)",
  "Spice Powders",
  "Mixed Spices / Custom Blend",
  "Multiple Products",
] as const;

// ── Product Catalogue ────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES = [
  "All",
  "Chillies",
  "Turmeric",
  "Coffee",
  "Spice Powders",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_FORMATS: Record<string, string[]> = {
  chilli:   ["Whole dried", "Powder", "Flakes / Crushed"],
  turmeric: ["Whole fingers", "Powder"],
  coffee:   ["Green beans", "Roasted beans", "Ground"],
  default:  ["Whole", "Powder", "Custom blend"],
};

// ── Certifications ───────────────────────────────────────────────────────────

/** Show renewal-pending badge when expiry is within this many days. */
export const CERT_RENEWAL_THRESHOLD_DAYS = 30;
