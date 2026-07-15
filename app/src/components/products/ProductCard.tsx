import { Link } from "@tanstack/react-router";
import { Leaf, MapPin, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/mockData";
import { formatGHS } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-warm">
      <Link
        to="/products/$id"
        params={{ id: String(product.id) }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur">
              <Leaf className="h-3 w-3" /> Organic
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-accent/95 px-2.5 py-1 text-[11px] font-semibold text-forest backdrop-blur">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-tight">{product.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {product.region} · {product.farmer.name}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs font-semibold">
            <Star className="h-3 w-3 fill-accent text-accent" /> {product.rating}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div>
            <span className="font-heading text-2xl font-bold text-forest">
              {formatGHS(product.price)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">/ {product.unit}</span>
          </div>
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              addItem(product, 1);
              toast.success(`${product.name} added to basket`);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
