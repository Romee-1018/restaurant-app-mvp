import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Served"
  | "Cancelled";

export type OrderType = "Dine-in" | "Takeaway";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  type: OrderType;
  table?: string;
  pickupTime?: string;
  status: OrderStatus;
  timestamp: string;
};

type OrdersState = {
  orders: Order[];
};

type CreateOrderPayload = {
  items: OrderItem[];
  total: number;
  type: OrderType;
  table?: string;
  pickupTime?: string;
};

type OrdersAction =
  | {
      type: "CREATE_ORDER";
      payload: CreateOrderPayload;
    }
  | {
      type: "UPDATE_STATUS";
      payload: {
        orderId: string;
        status: OrderStatus;
      };
    }
  | {
      type: "CANCEL_ORDER";
      payload: string;
    }
  | {
      type: "CLEAR_ORDERS";
    }
  | {
      type: "LOAD_ORDERS";
      payload: Order[];
    };

const ORDERS_STORAGE_KEY = "@savoria_orders";

const initialState: OrdersState = {
  orders: [],
};

function ordersReducer(
  state: OrdersState,
  action: OrdersAction
): OrdersState {
  switch (action.type) {
    case "CREATE_ORDER": {
      const newOrder: Order = {
        id: `SV-${Date.now().toString().slice(-6)}`,
        items: action.payload.items,
        total: action.payload.total,
        type: action.payload.type,
        table: action.payload.table,
        pickupTime: action.payload.pickupTime,
        status: "Pending",
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        orders: [...state.orders, newOrder],
      };
    }

    case "UPDATE_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                status: action.payload.status,
              }
            : order
        ),
      };

    case "CANCEL_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload
            ? {
                ...order,
                status: "Cancelled",
              }
            : order
        ),
      };

    case "CLEAR_ORDERS":
      return {
        ...initialState,
      };

    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
}

type OrdersContextType = {
  orders: Order[];
  createOrder: (payload: CreateOrderPayload) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;
  cancelOrder: (orderId: string) => void;
  clearOrders: () => void;
  loadOrders: (orders: Order[]) => void;
  isLoading: boolean;
};

const OrdersContext = createContext<
  OrdersContextType | undefined
>(undefined);

export function OrdersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    ordersReducer,
    initialState
  );

  const [isLoading, setIsLoading] = useState(true);

  /*
   * Load saved orders when the app starts.
   */
  useEffect(() => {
    const loadSavedOrders = async () => {
      try {
        const savedOrders =
          await AsyncStorage.getItem(
            ORDERS_STORAGE_KEY
          );

        if (savedOrders) {
          const parsedOrders: Order[] =
            JSON.parse(savedOrders);

          dispatch({
            type: "LOAD_ORDERS",
            payload: parsedOrders,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedOrders();
  }, []);

  /*
   * Save orders whenever the orders state changes.
   *
   * We wait until the initial AsyncStorage loading
   * has completed so that the empty initial state
   * does not overwrite saved orders.
   */
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify(state.orders)
        );
      } catch (error) {
        console.error(
          "Failed to save orders:",
          error
        );
      }
    };

    saveOrders();
  }, [state.orders, isLoading]);

  const createOrder = (
    payload: CreateOrderPayload
  ) => {
    dispatch({
      type: "CREATE_ORDER",
      payload,
    });
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus
  ) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: {
        orderId,
        status,
      },
    });
  };

  const cancelOrder = (orderId: string) => {
    dispatch({
      type: "CANCEL_ORDER",
      payload: orderId,
    });
  };

  const clearOrders = () => {
    dispatch({
      type: "CLEAR_ORDERS",
    });
  };

  const loadOrders = (orders: Order[]) => {
    dispatch({
      type: "LOAD_ORDERS",
      payload: orders,
    });
  };

  return (
    <OrdersContext.Provider
      value={{
        orders: state.orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        clearOrders,
        loadOrders,
        isLoading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrdersProvider"
    );
  }

  return context;
}