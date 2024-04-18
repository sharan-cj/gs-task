import { create } from "zustand";
import { TProduct } from "../utils/types";
import { fetchProducts } from "../api";
import { persist } from "zustand/middleware";

type TProductsStore = {
  products: TProduct[];
  fetch: (limit: number) => Promise<void>;

  productRanking: Record<string, number>;
  setRanking: (itemId: string, index: number) => void;

  draggingItemId: string | null;
  setDraggingItemId: (id: string | null) => void;
};

export const useProductsStore = create<
  TProductsStore,
  [["zustand/persist", TProductsStore]]
>(
  persist(
    (set) => ({
      products: [],
      fetch: async (limit) => {
        const response = await fetchProducts(limit);
        set({ products: response.data });
      },

      productRanking: {},
      setRanking: (itemId, index) =>
        set(
          (prev) => {
            const newRanking: Record<string, number> = Object.create(null);
            console.log(itemId, "itemId");
            Object.entries(prev.productRanking).forEach(([key, value]) => {
              if (key === itemId) {
                newRanking[key] = index;
              } else if (value >= index) {
                newRanking[key] = value + 1;
              } else {
                newRanking[key] = value;
              }
            });

            if (!newRanking[itemId]) {
              newRanking[itemId] = index;
            }
            return { productRanking: newRanking };
          }

          // productRanking: { ...prev.productRanking, },
        ),

      draggingItemId: null,
      setDraggingItemId: (id) => set({ draggingItemId: id }),
    }),
    {
      name: "products",
    }
  )
);
