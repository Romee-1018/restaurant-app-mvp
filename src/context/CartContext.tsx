import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

import { cartReducer } from "@/reducers/cartReducer";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSpecial: boolean;
  isAvailable: boolean;
  quantity: number;
  note: string;
};

export type CartState = {
  items: CartItem[];
  promoCode: string;
  discountPercent: number;
  promoError: string;
};

type CartContextType = {
  state: CartState;
  addItem: (
    item: Omit<CartItem, "quantity" | "note">
  ) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
};

const initialCartState: CartState = {
  items: [],
  promoCode: "",
  discountPercent: 0,
  promoError: "",
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState
  );

  const addItem = (
    item: Omit<CartItem, "quantity" | "note">
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  };

  const removeItem = (id: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  };

  const increment = (id: string) => {
    dispatch({
      type: "INCREMENT",
      payload: id,
    });
  };

  const decrement = (id: string) => {
    dispatch({
      type: "DECREMENT",
      payload: id,
    });
  };

  const updateNote = (
    id: string,
    note: string
  ) => {
    dispatch({
      type: "UPDATE_NOTE",
      payload: {
        id,
        note,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const applyPromo = (code: string) => {
    dispatch({
      type: "APPLY_PROMO",
      payload: code,
    });
  };

  const removePromo = () => {
    dispatch({
      type: "REMOVE_PROMO",
    });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        increment,
        decrement,
        updateNote,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}