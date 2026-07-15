// AgroLink Ghana API Client
import type { Product, Region } from "./mockData";

// Get API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export type ProductFilters = {
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  organic?: boolean;
  featured?: boolean;
  minRating?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
};

export const api = {
  async getProducts(filters: ProductFilters = {}): Promise<{ data: Product[]; total: number }> {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.region) params.append("region", filters.region);
    if (filters.search) params.append("search", filters.search);
    if (filters.organic) params.append("organic", "true");

    const queryString = params.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ""}`;

    const response = await fetchAPI<{ success: boolean; count: number; data: Product[] }>(endpoint);

    // Apply client-side filters and sorting that the API doesn't handle
    let list = response.data;

    if (filters.minPrice != null) list = list.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice != null) list = list.filter((p) => p.price <= filters.maxPrice!);
    if (filters.minRating != null) list = list.filter((p) => p.rating >= filters.minRating!);

    // Client-side sorting
    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => b.harvestDate.localeCompare(a.harvestDate));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return { data: list, total: list.length };
  },

  async getProduct(id: number): Promise<Product | null> {
    try {
      const response = await fetchAPI<{ success: boolean; data: Product }>(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      // Return null if product not found
      return null;
    }
  },

  async getRegions(): Promise<Region[]> {
    const response = await fetchAPI<{ success: boolean; data: Region[] }>("/api/delivery/regions");
    return response.data;
  },

  async calculateDelivery(regionId: number, weight: number) {
    try {
      const response = await fetchAPI<{
        success: boolean;
        data: {
          region: string;
          deliveryCost: number;
          estimatedDays: string;
          weight: number;
          basePrice: number;
          pricePerKg: number;
        };
      }>("/api/delivery/calculate", {
        method: "POST",
        body: JSON.stringify({ regionId, weight }),
      });

      return {
        fee: response.data.deliveryCost,
        estimatedDays: response.data.estimatedDays,
        region: response.data.region,
      };
    } catch (error) {
      return null;
    }
  },

  async createOrder<T extends object>(orderData: T) {
    const response = await fetchAPI<{
      success: boolean;
      message: string;
      data: {
        id: number;
        orderNumber: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      } & T;
    }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    return {
      id: response.data.orderNumber,
      ...orderData,
      status: response.data.status as "pending",
      createdAt: response.data.createdAt,
    };
  },
};

export const formatGHS = (n: number) =>
  `GH₵ ${n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
