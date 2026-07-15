import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Truck, ShieldCheck, HandHeart, Star, Sprout } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { CATEGORIES, REGIONS } from "@/lib/mockData";
import { useProducts } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/")({ component: Home });

const TRUST = [
  { icon: Leaf, label: "100% Organic options" },
  { icon: HandHeart, label: "Direct-from-farmer" },
  { icon: Truck, label: "Nationwide delivery" },
  { icon: ShieldCheck, label: "Secure payment" },
];

const TESTIMONIALS = [
  {
    name: "Selorm A.",
    role: "Chef, Accra",
    quote:
      "The tomatoes arrive so fresh I can taste the sun on them. My kitchen won't buy anywhere else.",
  },
  {
    name: "Auntie Ama",
    role: "Home cook, Kumasi",
    quote:
      "Same-week harvest, half the price of the market, and I know exactly which farm my yam came from.",
  },
  {
    name: "Kwesi B.",
    role: "Restaurateur, Takoradi",
    quote:
      "Reliable weekly delivery of cocoa and plantain. Akuafo has become part of our supply chain.",
  },
];

function Home() {
  // Fetch featured products from API
  const { data: productsData, isLoading, error } = useProducts({ featured: true });
  const featured = productsData?.data.slice(0, 6) || [];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Ghanaian farmers with baskets of freshly harvested cassava at golden hour"
          width={1600}
          height={1000}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="gradient-hero absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl text-cream">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
              <Sprout className="h-3.5 w-3.5" /> From soil to supper
            </span>
            <h1 className="mt-6 font-heading font-extrabold text-cream">
              Ghana's harvest,
              <br />
              <span className="text-accent">honestly delivered.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
              A marketplace built for the people who feed the nation. Buy fresh crops straight from
              verified farms across all 16 regions — no middlemen, no mystery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="rounded-full bg-accent text-forest hover:bg-accent/90">
                  Shop the harvest <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
                >
                  Meet the farmers
                </Button>
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-cream/20 pt-6 text-cream">
              {[
                ["16", "Regions served"],
                ["400+", "Verified farms"],
                ["24hr", "Fastest delivery"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-heading text-3xl font-bold">{n}</dt>
                  <dd className="text-xs uppercase tracking-wider text-cream/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border/60 bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Browse</p>
            <h2 className="mt-2">Shop by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.name }}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-warm"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-3xl transition-colors group-hover:bg-accent/50">
                {c.icon}
              </span>
              <span className="text-sm font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                This week's pick
              </p>
              <h2 className="mt-2">Fresh from the field</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
              View all crops →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Loading fresh products...
              </div>
            )}
            {error && (
              <div className="col-span-full text-center text-red-600 py-8">
                Failed to load products. Please try again.
              </div>
            )}
            {!isLoading && !error && featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Kind words</p>
          <h2 className="mt-2">Loved by kitchens across Ghana</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-7 shadow-soft"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-heading text-lg leading-snug text-forest">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-muted-foreground"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Regions strip */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Nationwide
              </p>
              <h2 className="mt-2 text-cream">We deliver to every region</h2>
              <p className="mt-3 text-cream/75">
                All 16 regions of Ghana — from Accra to Bawku, at fair, transparent rates.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {REGIONS.map((r) => (
                <li key={r.id} className="flex items-center gap-2 text-sm text-cream/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {r.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
