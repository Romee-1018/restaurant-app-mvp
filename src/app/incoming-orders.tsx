import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { request } from "@/api/client";
import { useOrders } from "@/context/OrdersContext";
import { useTheme } from "@/context/ThemeContext";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Served"
  | "Cancelled";

type OrderItem = {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
};

type IncomingOrder = {
  _id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default function IncomingOrdersScreen() {
  const { colors } = useTheme();
  const { refreshOrders } = useOrders();
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(
    async (showError = true) => {
      try {
        const data = await request("/api/orders");
        setOrders(Array.isArray(data) ? data : []);

        // Keep the shared orders (Manager Dashboard counts) up to date too
        refreshOrders();
      } catch (error) {
        if (showError) {
          Alert.alert(
            "Orders Error",
            error instanceof Error ? error.message : "Could not load orders."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [refreshOrders]
  );

  // Load now, then every ten seconds so new customer orders appear
  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleManage = async (orderId: string, status: OrderStatus) => {
    let nextStatus: OrderStatus | null = null;

    if (status === "Pending") nextStatus = "Preparing";
    else if (status === "Preparing") nextStatus = "Ready";
    else if (status === "Ready") nextStatus = "Served";

    if (!nextStatus) return;

    try {
      setUpdatingOrderId(orderId);

      const updatedOrder = await request(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: { status: nextStatus },
        }
      );

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );

      refreshOrders();
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error instanceof Error ? error.message : "Could not update order."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getButtonText = (status: OrderStatus) => {
    if (status === "Pending") return "Start Preparing";
    if (status === "Preparing") return "Mark Ready";
    if (status === "Ready") return "Mark Served";
    if (status === "Served") return "Served";
    return "Cancelled";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/manager-dashboard")}
          style={[
            styles.backButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.backText, { color: colors.text }]}>‹</Text>
        </Pressable>

        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Incoming Orders
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Manage customer orders
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              Loading customer orders...
            </Text>
          </View>
        ) : orders.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Incoming Orders
            </Text>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              New customer orders will appear here.
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order._id}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[styles.orderId, { color: colors.text }]}
                  numberOfLines={1}
                >
                  Order #{order._id.slice(-6).toUpperCase()}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    order.status === "Pending" && styles.pending,
                    order.status === "Preparing" && styles.preparing,
                    order.status === "Ready" && styles.ready,
                    order.status === "Served" && styles.served,
                    order.status === "Cancelled" && styles.cancelled,
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <Text style={[styles.orderType, { color: colors.secondaryText }]}>
                Customer: {order.user?.name || order.user?.email || "Customer"}
              </Text>

              {order.createdAt ? (
                <Text
                  style={[styles.orderType, { color: colors.secondaryText }]}
                >
                  {new Date(order.createdAt).toLocaleString()}
                </Text>
              ) : null}

              <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                  <View
                    key={item._id || `${order._id}-${index}`}
                    style={styles.itemRow}
                  >
                    <Text style={[styles.itemName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.itemQuantity,
                        { color: colors.secondaryText },
                      ]}
                    >
                      x {item.quantity}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.bottomRow}>
                <Text style={[styles.total, { color: colors.text }]}>
                  Rs. {(order.totalAmount || 0).toLocaleString()}
                </Text>

                {order.status !== "Served" &&
                order.status !== "Cancelled" ? (
                  <Pressable
                    disabled={updatingOrderId === order._id}
                    onPress={() => handleManage(order._id, order.status)}
                    style={({ pressed }) => [
                      styles.manageButton,
                      { backgroundColor: colors.primary },
                      pressed && styles.manageButtonPressed,
                      updatingOrderId === order._id && { opacity: 0.6 },
                    ]}
                  >
                    <Text
                      style={[styles.manageText, { color: colors.primaryText }]}
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : getButtonText(order.status)}
                    </Text>
                  </Pressable>
                ) : (
                  <View
                    style={[
                      styles.completedButton,
                      order.status === "Cancelled" && styles.cancelledButton,
                    ]}
                  >
                    <Text
                      style={
                        order.status === "Cancelled"
                          ? styles.cancelledButtonText
                          : styles.completedButtonText
                      }
                    >
                      {order.status === "Cancelled" ? "Cancelled" : "✓ Served"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  backText: {
    fontSize: 32,
    lineHeight: 34,
    marginTop: -4,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 12,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  orderType: {
    fontSize: 12,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pending: {
    backgroundColor: "#FFF0D6",
  },
  preparing: {
    backgroundColor: "#E6F0FF",
  },
  ready: {
    backgroundColor: "#E9E0FF",
  },
  served: {
    backgroundColor: "#E4F7EA",
  },
  cancelled: {
    backgroundColor: "#FFE5E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#333",
  },
  itemsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: "800",
    flexShrink: 1,
  },
  manageButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  manageButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  manageText: {
    fontSize: 12,
    fontWeight: "800",
  },
  completedButton: {
    backgroundColor: "#E4F7EA",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  completedButtonText: {
    color: "#267A3D",
    fontSize: 12,
    fontWeight: "800",
  },
  cancelledButton: {
    backgroundColor: "#FFE5E2",
  },
  cancelledButtonText: {
    color: "#C0392B",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 7,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
  },
});