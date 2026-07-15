import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Leaf, MapPin, Star, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useProduct, useProducts } from "@/hooks/useApi";
import { formatGHS } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { data: productsData } = useProducts();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  // Get related products from the same category
  const related =
    productsData?.data
      .filter((p) => product && p.category === product.category && p.id !== product.id)
      .slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1>Crop not found</h1>
          <p className="mt-2 text-muted-foreground">This item isn't in our current listings.</p>
          <Link to="/products" className="mt-6 inline-block text-primary underline">
            Back to marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary">
            Marketplace
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-3xl bg-muted shadow-warm">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                {product.category}
              </Badge>
              {product.organic && (
                <Badge className="rounded-full bg-primary text-primary-foreground">
                  <Leaf className="mr-1 h-3 w-3" /> Organic
                </Badge>
              )}
              {product.featured && (
                <Badge className="rounded-full bg-accent text-forest">Featured</Badge>
              )}
            </div>

            <h1 className="font-heading">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" /> {product.rating} ·{" "}
                {product.reviews} reviews
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {product.region}
              </span>
              <span>
                Harvested{" "}
                {new Date(product.harvestDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <p className="text-lg leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-2 border-y border-border/60 py-5">
              <span className="font-heading text-4xl font-bold text-forest">
                {formatGHS(product.price)}
              </span>
              <span className="text-muted-foreground">per {product.unit}</span>
              <span className="ml-auto text-xs font-medium text-primary">
                {product.stock} {product.unit} available
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 rounded-full sm:flex-none sm:px-10"
                onClick={() => {
                  addItem(product, qty);
                  toast.success(`${qty} ${product.unit} of ${product.name} added to basket`);
                }}
              >
                Add {formatGHS(product.price * qty)} to basket
              </Button>
            </div>

            {/* Farmer card */}
            <div className="mt-4 rounded-3xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 font-heading text-xl text-primary">
                  {product.farmer.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Farmer</p>
                  <p className="font-heading text-lg">
                    {product.farmer.name}{" "}
                    {product.farmer.verified && (
                      <span className="text-xs text-primary">✓ Verified</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.farmer.farmSize} · {product.farmer.region} region · ⭐{" "}
                    {product.farmer.rating}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Fast delivery</p>
                  <p className="text-xs text-muted-foreground">Regional rates from GH₵ 20</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Freshness promise</p>
                  <p className="text-xs text-muted-foreground">Refunded if not fresh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-8">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
