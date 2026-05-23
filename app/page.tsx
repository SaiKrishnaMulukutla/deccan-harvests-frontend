import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Origin from "@/components/sections/Origin";
import Products from "@/components/sections/Products";
import Metrics from "@/components/sections/Metrics";
import Process from "@/components/sections/Process";
import Certifications from "@/components/sections/Certifications";
import GlobalReach from "@/components/sections/GlobalReach";
import Gallery from "@/components/sections/Gallery";
import RFQ from "@/components/sections/RFQ";
import { apiFetch } from "@/lib/api";
import type { Product, Certification } from "@/lib/types";

export default async function HomePage() {
  const [products, certs] = await Promise.all([
    apiFetch<Product[]>("/api/v1/products", { revalidate: 3600 }),
    apiFetch<Certification[]>("/api/v1/certifications", { revalidate: 3600 }),
  ]);

  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Origin />
      <Products products={products ?? []} />
      <Metrics />
      <Process />
      <Certifications certs={certs ?? []} />
      <GlobalReach />
      <Gallery />
      <RFQ />
      <Footer />
    </main>
  );
}
