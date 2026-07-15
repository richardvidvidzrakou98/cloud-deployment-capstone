import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBasket, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cart-context";
import { formatGHS } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your basket — Akuafo Market" },
      { name: "description", content: "Review your selected crops before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, updateQty, removeItem, count, totalWeight } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-muted">
            <ShoppingBasket className="h-9 w-9 text-muted-foreground" />
          </span>
          <h1 className="mt-6">Your basket is empty</h1>
          <p className="mt-3 text-muted-foreground">
            Head to the marketplace and pick something fresh.
          </p>
          <Link to="/products" className="mt-8 inline-block">
            <Button size="lg" className="rounded-full">
              Browse crops <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = 20 + totalWeight * 2;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1>Your basket</h1>
        <p className="mt-2 text-muted-foreground">
          {count} {count === 1 ? "item" : "items"} · ready for checkout
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="grid grid-cols-[96px_1fr_auto] gap-5 rounded-3xl border border-border/60 bg-card p-4 sm:grid-cols-[120px_1fr_auto] sm:p-5"
              >
                <Link
                  to="/products/$id"
                  params={{ id: String(product.id) }}
                  className="overflow-hidden rounded-2xl"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to="/products/$id"
                    params={{ id: String(product.id) }}
                    className="font-heading text-lg hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {product.farmer.name} · {product.region}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-forest">
                    {formatGHS(product.price)} / {product.unit}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQty(product.id, quantity - 1)}
                      aria-label="decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQty(product.id, quantity + 1)}
                      aria-label="increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <span className="font-heading text-xl font-bold">
                    {formatGHS(product.price * quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-border/60 bg-card p-6 lg:sticky lg:top-24">
            <h3 className="font-heading text-xl">Order summary</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal ({count} items)</dt>
                <dd className="font-semibold">{formatGHS(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Est. delivery (Greater Accra)</dt>
                <dd className="font-semibold">{formatGHS(estimatedDelivery)}</dd>
              </div>
              <div className="my-3 border-t border-border" />
              <div className="flex items-baseline justify-between">
                <dt className="font-heading text-lg">Total</dt>
                <dd className="font-heading text-2xl font-bold text-forest">
                  {formatGHS(subtotal + estimatedDelivery)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Final delivery calculated at checkout based on your region.
            </p>
            <Link to="/checkout" className="mt-6 block">
              <Button size="lg" className="w-full rounded-full">
                Proceed to checkout <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary"
            >
              or keep shopping
            </Link>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
