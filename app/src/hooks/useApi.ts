import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ProductFilters } from "../lib/api";

/**
 * Hook to fetch all products with optional filters
 */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all delivery regions
 */
export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => api.getRegions(),
    staleTime: 60 * 60 * 1000, // Regions rarely change, cache for 1 hour
  });
}

/**
 * Hook to calculate delivery cost
 */
export function useCalculateDelivery() {
  return useMutation({
    mutationFn: ({ regionId, weight }: { regionId: number; weight: number }) =>
      api.calculateDelivery(regionId, weight),
  });
}

/**
 * Hook to create an order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: any) => api.createOrder(orderData),
    onSuccess: () => {
      // Invalidate any relevant queries after order creation
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
