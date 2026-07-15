import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Users, Truck, HandHeart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our story — Akuafo Market" },
      {
        name: "description",
        content:
          "We connect Ghanaian farmers directly with consumers to build a fairer, fresher food system.",
      },
      { property: "og:title", content: "Our story — Akuafo Market" },
      { property: "og:description", content: "Building a fairer, fresher food system for Ghana." },
    ],
  }),
  component: About,
});

const STATS = [
  { n: "400+", l: "Verified farmers" },
  { n: "16", l: "Regions served" },
  { n: "12 000+", l: "Baskets delivered" },
  { n: "38%", l: "More income for farmers" },
];

const VALUES = [
  {
    icon: Sprout,
    title: "Grown honestly",
    body: "Every crop is traceable to a named farm. What you see is what you receive.",
  },
  {
    icon: Users,
    title: "Farmers first",
    body: "We keep prices fair and margins visible so growers earn what their work is worth.",
  },
  {
    icon: Truck,
    title: "Fast and gentle",
    body: "Cold-chain logistics from farm gate to your door — no wilted greens on our watch.",
  },
  {
    icon: HandHeart,
    title: "Community rooted",
    body: "A percentage of every order funds farmer training and cooperative programs.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="border-b border-border/60 bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our story</p>
          <h1 className="mt-3 font-heading">Built for the hands that feed Ghana.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Akuafo — Twi for <em>farmer</em> — began as a simple idea: cut the chain of middlemen
            between the field and the family kitchen. Today we deliver fresh, traceable crops across
            all 16 regions, and every cedi flows more directly to the people who grew it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(({ n, l }) => (
            <div key={l} className="rounded-3xl border border-border/60 bg-card p-6 text-center">
              <dt className="font-heading text-4xl font-bold text-forest">{n}</dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center">What we stand for</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-5 rounded-3xl border border-border/60 bg-card p-7"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-xl">{title}</h3>
                  <p className="mt-2 text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
