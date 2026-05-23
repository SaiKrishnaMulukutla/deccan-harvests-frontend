import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Origin from "@/components/sections/Origin";
import Products from "@/components/sections/Products";
import Metrics from "@/components/sections/Metrics";
import Process from "@/components/sections/Process";
import Certifications from "@/components/sections/Certifications";
import Gallery from "@/components/sections/Gallery";
import RFQ from "@/components/sections/RFQ";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Origin />
      <Products />
      <Metrics />
      <Process />
      <Certifications />
      <Gallery />
      <RFQ />
      <Footer />
    </main>
  );
}
