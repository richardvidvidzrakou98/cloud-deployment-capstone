import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { CATEGORIES, REGIONS } from "@/lib/mockData";
import { useProducts } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  category: z.string().optional(),
  region: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Marketplace — Akuafo Market" },
      {
        name: "description",
        content:
          "Browse fresh crops from verified Ghanaian farms. Filter by category, region, price and rating.",
      },
      { property: "og:title", content: "Marketplace — Akuafo Market" },
      {
        property: "og:description",
        content: "Fresh crops from farms across all 16 regions of Ghana.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [category, setCategory] = useState<string>(search.category ?? "all");
  const [region, setRegion] = useState<string>(search.region ?? "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API with filters
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    category: category !== "all" ? category : undefined,
    region: region !== "all" ? region : undefined,
    organic: organicOnly || undefined,
    search: q.trim() || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sort as any,
  });

  const filtered = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data;
  }, [productsData]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="border-b border-border/60 bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Marketplace
          </p>
          <h1 className="mt-2 font-heading">Every crop, every region.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search across our verified farms. Filter by what you need — organic, budget, region —
            and add straight to your basket.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 md:max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search cassava, tomatoes, cocoa…"
                className="h-12 rounded-full border-border/60 bg-card pl-11 pr-4"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-full lg:hidden"
              onClick={() => setShowFilters((s) => !s)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 min-w-44 rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: low → high</SelectItem>
                <SelectItem value="price-desc">Price: high → low</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="newest">Freshest harvest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 space-y-8 rounded-3xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg">Refine</h3>
                <button
                  onClick={() => {
                    setCategory("all");
                    setRegion("all");
                    setPriceRange([0, 60]);
                    setOrganicOnly(false);
                    setQ("");
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Price (GH₵)
                  </Label>
                  <span className="text-xs font-semibold">
                    {priceRange[0]} — {priceRange[1]}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={60}
                  step={1}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
                <div>
                  <p className="text-sm font-semibold">Organic only</p>
                  <p className="text-xs text-muted-foreground">Certified natural growing</p>
                </div>
                <Switch checked={organicOnly} onCheckedChange={setOrganicOnly} />
              </div>
            </div>
          </aside>

          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "crop" : "crops"}
                </>
              )}
            </p>
            {isLoading && (
              <div className="rounded-3xl border border-border p-16 text-center">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            )}
            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-16 text-center">
                <p className="font-heading text-2xl text-red-600">Failed to load products</p>
                <p className="mt-2 text-sm text-red-600">Please try again later.</p>
              </div>
            )}
            {!isLoading && !error && (
              <>
                {filtered.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                    <p className="font-heading text-2xl">No crops match</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try clearing a filter or broadening the search.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
