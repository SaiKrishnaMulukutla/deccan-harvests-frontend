import Link from "next/link";
import { authFetch } from "@/lib/auth";
import type { Product } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:   "text-green-400 bg-green-400/10 border-green-400/20",
  INACTIVE: "text-white/30 bg-white/5 border-white/10",
  SEASONAL: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default async function ProductsAdminPage() {
  const products = await authFetch<Product[]>("/api/v1/products/admin/all") ?? [];

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-smoke mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Products
        <span className="ml-3 text-[0.75rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
          {products.length} total
        </span>
      </h1>

      <div className="border border-white/8">
        {products.length === 0 ? (
          <p className="p-8 text-center text-[0.82rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            No products yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Slug", "Variety", "Status", "Images"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.6rem] tracking-[0.12em] text-white/25 uppercase font-normal"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="text-[0.8rem] text-smoke hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[0.72rem] text-white/40 font-mono">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
                    {product.variety ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[0.58rem] tracking-widest uppercase border rounded-sm ${STATUS_COLORS[product.status]}`}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/40" style={{ fontFamily: "var(--font-inter)" }}>
                    {product.images.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
