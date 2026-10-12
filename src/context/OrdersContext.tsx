import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { request } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

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
  customer?: string;
};

type CreateOrderPayload = {
  items: OrderItem[];
  // Not sent to the server. The server works out the total itself.
  total?: number;
  type?: OrderType;
  table?: string;
  pickupTime?: string;
};

// The shape the server sends
type ServerOrder = {
  _id: string;
  user?: { name?: string } | string;
  items: {
    menuItem: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

// Turn a server order into the shape the screens already use
function toAppOrder(order: ServerOrder): Order {
  return {
    id: order._id,
    items: order.items.map((item) => ({
      id: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    total: order.totalAmount,
    type: "Takeaway",
    status: order.status,
    timestamp: order.createdAt,
    customer:
      typeof order.user === "object" ? order.user?.name : undefined,
  };
}

type ActionResult = {
  success: boolean;
  message: string;
};

type OrdersContextType = {
  orders: Order[];
  isLoading: boolean;
  error: string;
  refreshOrders: () => Promise<void>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => Promise<ActionResult>;
  cancelOrder: (orderId: string) => Promise<ActionResult>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const loggedIn = !!user;
  const role = user?.role;

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Manager gets all orders, a customer gets only their own
  const refreshOrders = useCallback(async () => {
    if (!loggedIn) {
      return;
    }

    try {
      const path = role === "manager" ? "/api/orders" : "/api/orders/my";
      const data: ServerOrder[] = await request(path);

      // The server sends the newest first. The screens expect the newest last.
      setOrders(data.map(toAppOrder).reverse());
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  }, [loggedIn, role]);

  // Load orders after login, and clear them after logout
  useEffect(() => {
    if (!loggedIn) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    refreshOrders().finally(() => setIsLoading(false));
  }, [loggedIn, refreshOrders]);

  // POST /api/orders. Only item ids and quantities are sent. The server
  // reads prices from the database, so a fake price or total is useless.
  const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const data: ServerOrder = await request("/api/orders", {
      method: "POST",
      body: {
        items: payload.items.map((item) => ({
          menuItem: item.id,
          quantity: item.quantity,
        })),
      },
    });

    const order = toAppOrder(data);
    setOrders((previous) => [...previous, order]);
    return order;
  };

  // PATCH /api/orders/:id/status
  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ): Promise<ActionResult> => {
    try {
      const data: ServerOrder = await request(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: { status },
        }
      );

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId ? { ...order, status: data.status } : order
        )
      );

      return { success: true, message: "" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const cancelOrder = (orderId: string) =>
    updateOrderStatus(orderId, "Cancelled");

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        refreshOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }

  return context;
}