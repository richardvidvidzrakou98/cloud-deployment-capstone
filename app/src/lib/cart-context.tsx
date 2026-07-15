import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./mockData";

export type CartItem = { productId: number; product: Product; quantity: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  totalWeight: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartCtx | null>(null);
const STORAGE_KEY = "crop-marketplace-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { productId: product.id, product, quantity }];
    });
  }, []);

  const updateQty = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((a, i) => a + i.product.price * i.quantity, 0);
    const totalWeight = items.reduce((a, i) => a + i.quantity, 0);
    const count = items.reduce((a, i) => a + i.quantity, 0);
    return { items, count, subtotal, totalWeight, addItem, updateQty, removeItem, clear };
  }, [items, addItem, updateQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
