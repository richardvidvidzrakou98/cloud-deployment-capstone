import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Check, CreditCard, Smartphone, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cart-context";
import { useRegions, useCalculateDelivery, useCreateOrder } from "@/hooks/useApi";
import { formatGHS } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Akuafo Market" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

const STEPS = ["Delivery", "Review", "Payment", "Done"] as const;

function CheckoutPage() {
  const { items, subtotal, totalWeight, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  // API hooks
  const { data: regionsData } = useRegions();
  const calculateDelivery = useCalculateDelivery();
  const createOrder = useCreateOrder();

  const regions = regionsData || [];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    regionId: "1",
    address: "",
    notes: "",
    payment: "momo",
  });

  const [deliveryCost, setDeliveryCost] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState<{ estimatedDays?: string; region?: string }>({});

  // Calculate delivery cost when region or weight changes
  useEffect(() => {
    if (form.regionId && totalWeight > 0) {
      calculateDelivery.mutate(
        { regionId: parseInt(form.regionId), weight: totalWeight },
        {
          onSuccess: (data) => {
            if (data) {
              setDeliveryCost(data.fee);
              setDeliveryInfo({ estimatedDays: data.estimatedDays, region: data.region });
            }
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.regionId, totalWeight]);

  const region = regions.find((r) => String(r.id) === form.regionId);
  const total = subtotal + deliveryCost;

  const setField = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canProceedDelivery =
    form.name.trim() && form.email.trim() && form.phone.trim() && form.address.trim();

  const placeOrder = async () => {
    try {
      const orderData = {
        items,
        total,
        deliveryCost,
        deliveryInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          region: deliveryInfo.region || region?.name || "",
          notes: form.notes,
        },
      };

      const order = await createOrder.mutateAsync(orderData);
      setOrderId(order.id);
      clear();
      setStep(3);
      toast.success("Order placed! We'll be in touch shortly.");
    } catch {
      toast.error("Something went wrong placing your order.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1>Checkout</h1>

        <ol className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={i <= step ? "font-semibold text-forest" : "text-muted-foreground"}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
            {step === 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="!mb-0 font-heading text-xl">Delivery details</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input value={form.name} onChange={(e) => setField("name", e.target.value)} />
                  </Field>
                  <Field label="Phone number">
                    <Input
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="+233…"
                    />
                  </Field>
                  <Field label="Email" className="sm:col-span-2">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Region">
                    <Select value={form.regionId} onValueChange={(v) => setField("regionId", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Estimated arrival">
                    <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                      {deliveryInfo.estimatedDays || region?.estimatedDays || "Calculating..."}
                    </div>
                  </Field>
                  <Field label="Address" className="sm:col-span-2">
                    <Input
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="Street, town, landmark"
                    />
                  </Field>
                  <Field label="Delivery notes (optional)" className="sm:col-span-2">
                    <Textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder="Gate code, alternative contact…"
                    />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canProceedDelivery}
                    onClick={() => setStep(1)}
                    className="rounded-full px-8"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="!mb-0 font-heading text-xl">Review your order</h3>
                </div>
                <div className="divide-y divide-border">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <span className="font-medium">
                        {product.name} × {quantity} {product.unit}
                      </span>
                      <span className="font-semibold">{formatGHS(product.price * quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-muted p-4 text-sm">
                  <p className="font-semibold">{form.name}</p>
                  <p className="text-muted-foreground">
                    {form.address} · {region?.name || "Selected region"}
                  </p>
                  <p className="text-muted-foreground">
                    {form.phone} · {form.email}
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(0)} className="rounded-full">
                    Back
                  </Button>
                  <Button onClick={() => setStep(2)} className="rounded-full px-8">
                    Continue to payment
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="!mb-0 font-heading text-xl">Payment</h3>
                </div>
                <RadioGroup
                  value={form.payment}
                  onValueChange={(v) => setField("payment", v)}
                  className="grid gap-3"
                >
                  {[
                    {
                      id: "momo",
                      label: "Mobile Money",
                      desc: "MTN, Vodafone, AirtelTigo",
                      Icon: Smartphone,
                    },
                    {
                      id: "card",
                      label: "Card (Paystack)",
                      desc: "Visa, Mastercard, Verve",
                      Icon: CreditCard,
                    },
                    {
                      id: "cod",
                      label: "Cash on delivery",
                      desc: "Pay the rider on arrival",
                      Icon: Truck,
                    },
                  ].map(({ id, label, desc, Icon }) => (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors ${form.payment === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                    >
                      <RadioGroupItem value={id} id={id} />
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  This is a demo — no real payment will be taken.
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">
                    Back
                  </Button>
                  <Button
                    onClick={placeOrder}
                    disabled={createOrder.isPending}
                    className="rounded-full px-8"
                  >
                    {createOrder.isPending ? "Placing order…" : `Pay ${formatGHS(total)}`}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && orderId && (
              <div className="py-6 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="mt-6">Order confirmed!</h2>
                <p className="mt-2 text-muted-foreground">
                  Reference{" "}
                  <span className="font-mono font-semibold text-foreground">{orderId}</span>
                </p>
                <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
                  A confirmation is on its way to your inbox. Expected delivery{" "}
                  {deliveryInfo.estimatedDays || region?.estimatedDays || "soon"}.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button className="rounded-full" onClick={() => navigate({ to: "/products" })}>
                    Keep shopping
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="rounded-full">
                      Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {step !== 3 && (
            <aside className="h-fit rounded-3xl border border-border/60 bg-card p-6 lg:sticky lg:top-24">
              <h3 className="font-heading text-xl">Summary</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatGHS(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Delivery ({deliveryInfo.region || region?.name || "Selected region"})
                  </dt>
                  <dd className="font-semibold">{formatGHS(deliveryCost)}</dd>
                </div>
                <div className="my-3 border-t border-border" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-heading text-lg">Total</dt>
                  <dd className="font-heading text-2xl font-bold text-forest">
                    {formatGHS(total)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                {totalWeight} kg · arrives in{" "}
                {deliveryInfo.estimatedDays || region?.estimatedDays || "calculating"}
              </p>
            </aside>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
