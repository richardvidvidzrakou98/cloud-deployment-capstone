import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Akuafo Market" },
      { name: "description", content: "Get in touch with the Akuafo Market team." },
      { property: "og:title", content: "Contact — Akuafo Market" },
      {
        property: "og:description",
        content: "Talk to our team about crops, deliveries or joining as a farmer.",
      },
    ],
  }),
  component: Contact,
});

const FAQ = [
  {
    q: "How fresh are your crops?",
    a: "Most items are harvested within 48 hours of dispatch. Delivery windows vary by region.",
  },
  {
    q: "Which regions do you deliver to?",
    a: "All 16 regions of Ghana. Rates and lead times are calculated at checkout.",
  },
  {
    q: "How do I become a farmer partner?",
    a: "Send us your farm details via the form below and our onboarding team will reach out.",
  },
  {
    q: "What payment methods are supported?",
    a: "Mobile Money (MTN / Vodafone / AirtelTigo), card via Paystack, and cash on delivery in select cities.",
  },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received! We'll reply within one working day.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Get in touch</p>
        <h1 className="mt-2">Talk to a real person.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Questions about a crop, a delivery or joining as a farmer? We answer within one working
          day.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Call us", value: "+233 30 123 4567" },
              { icon: Mail, label: "Email", value: "hello@akuafo.market" },
              { icon: MapPin, label: "Visit", value: "12 Farm Road, East Legon, Accra" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="font-heading text-lg">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="space-y-5 rounded-3xl border border-border/60 bg-card p-7 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full">
              Send message <Send className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center">Frequently asked</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-border/60 bg-card p-5 open:shadow-soft"
              >
                <summary className="cursor-pointer list-none font-heading text-lg font-semibold marker:hidden">
                  <span className="mr-2 text-primary transition-transform group-open:rotate-45 inline-block">
                    +
                  </span>
                  {q}
                </summary>
                <p className="mt-3 pl-6 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
