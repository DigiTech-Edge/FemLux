import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  variant: CartVariant;
  product: {
    name: string;
    images: string[];
    variants: CartVariant[]; // All available variants
  };
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  addItem: (
    product: {
      id: string;
      name: string;
      images: string[];
      variants: CartVariant[];
    },
    variant: CartVariant,
    quantity: number
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  switchVariant: (
    productId: string,
    currentVariantId: string,
    newVariantId: string
  ) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      total: 0,

      addItem: (product, variant, quantity) => {
        const items = get().items;
        const existingItem = items.find(
          (item) =>
            item.productId === product.id && item.variantId === variant.id
        );

        if (existingItem) {
          return get().updateQuantity(
            product.id,
            variant.id,
            existingItem.quantity + quantity
          );
        }

        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.id,
          quantity,
          variant,
          product: {
            name: product.name,
            images: product.images,
            variants: product.variants,
          },
        };

        set((state) => {
          const newItems = [...state.items, newItem];
          const newSubtotal = calculateSubtotal(newItems);
          return {
            items: newItems,
            itemCount: state.itemCount + quantity,
            subtotal: newSubtotal,
            total: newSubtotal,
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          const item = state.items.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (!item) return state;

          const newItems = state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          );
          const newSubtotal = calculateSubtotal(newItems);

          return {
            items: newItems,
            itemCount: state.itemCount - item.quantity,
            subtotal: newSubtotal,
            total: newSubtotal,
          };
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          return get().removeItem(productId, variantId);
        }

        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.productId === productId && item.variantId === variantId) {
              return { ...item, quantity };
            }
            return item;
          });

          const newItemCount = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const newSubtotal = calculateSubtotal(newItems);

          return {
            items: newItems,
            itemCount: newItemCount,
            subtotal: newSubtotal,
            total: newSubtotal,
          };
        });
      },

      switchVariant: (productId, currentVariantId, newVariantId) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (
              item.productId === productId &&
              item.variantId === currentVariantId
            ) {
              const newVariant = item.product.variants.find(
                (v) => v.id === newVariantId
              );
              if (!newVariant) return item;

              return {
                ...item,
                variantId: newVariant.id,
                variant: newVariant,
              };
            }
            return item;
          });

          const newSubtotal = calculateSubtotal(newItems);
          return {
            ...state,
            items: newItems,
            subtotal: newSubtotal,
            total: newSubtotal,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          total: 0,
        });
      },
    }),
    {
      name: "femlux-cart",
      // skipHydration: true,
    }
  )
);

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
};
