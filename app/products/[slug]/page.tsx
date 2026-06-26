import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/app/data/products";
import { formatPKR } from "@/lib/utils";
import ProductActions from "./ProductActions";
import ProductReviews from "./ProductReviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find(
    (p) => p.slug === slug || String(p.id) === slug
  );

  if (!product) notFound();

  const stockLabel =
    product.stock <= 0 ? "Out of Stock" :
    product.stock < 5 ? "Low Stock" : "In Stock";
  const stockColor =
    product.stock <= 0 ? "#e07070" :
    product.stock < 5 ? "#d9a441" : "#7ecf8a";

  return (
    <main>
      <Navbar />
      <section className="section">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          <div className="imageWrap" style={{ height: "400px", position: "relative" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
              style={{ objectFit: "cover", borderRadius: "12px" }}
              priority
            />
          </div>
          <div>
            <span className="badge">{product.category}</span>
            <h1 style={{ margin: "12px 0" }}>{product.name}</h1>
            <p style={{ fontSize: "24px", color: "#d9a441", fontFamily: "Cinzel, serif" }}>
              {formatPKR(product.price_pkr)}
            </p>
            <p style={{ fontSize: "13px", color: "#b8a080", marginBottom: "12px" }}>
              USD ${product.price.toLocaleString()}
            </p>
            <span style={{ color: stockColor, fontSize: "13px", fontWeight: 600 }}>{stockLabel}</span>
            <p style={{ margin: "16px 0", color: "#b8a080" }}>{product.detail}</p>
            <ProductActions product={product} />
          </div>
        </div>

        <div style={{ marginTop: "48px" }}>
          <h2 style={{ marginBottom: "16px" }}>Reviews</h2>
          <ProductReviews productId={String(product.id)} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
