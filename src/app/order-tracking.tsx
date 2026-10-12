import { router, useLocalSearchParams } from "expo-router";
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
import { useTheme } from "@/context/ThemeContext";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Served"
  | "Cancelled";

type ServerOrder = {
  _id: string;
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

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
];

export default function OrderTrackingScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ orderId?: string | string[] }>();

  const wantedId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState<ServerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const loadOrder = useCallback(
    async (showError = false) => {
      try {
        const orders = (await request("/api/orders/my")) as ServerOrder[];

        // The server sends the newest order first.
        // Without an order id, show the latest order.
        const foundOrder = wantedId
          ? orders.find((item) => item._id === wantedId)
          : orders[0];

        if (foundOrder) {
          setOrder(foundOrder);
        } else if (showError) {
          Alert.alert("Order Not Found", "This order could not be found.");
        }
      } catch (error) {
        if (showError) {
          Alert.alert(
            "Order Loading Failed",
            (error as Error).message || "Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [wantedId]
  );

  // Poll GET /api/orders/my every ten seconds so the customer sees
  // the status change when the manager updates it.
  useEffect(() => {
    loadOrder(true);

    const interval = setInterval(() => {
      loadOrder(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [loadOrder]);

  useEffect(() => {
    if (!order) return;

    const updateElapsed = () => {
      const createdAt = new Date(order.createdAt).getTime();
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - createdAt) / 1000))
      );
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [order?.createdAt]);

  if (loading) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
          Loading your order...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyIcon, { color: colors.secondaryText }]}>📦</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Order Found
        </Text>
        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
          We could not find this order. Check your connection and try again.
        </Text>
        <Pressable
          onPress={() => loadOrder(true)}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            Retry
          </Text>
        </Pressable>
        <Pressable onPress={() => router.replace("/explore")} style={styles.backButton}>
          <Text style={{ color: colors.primary }}>Back to Menu</Text>
        </Pressable>
      </View>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.brand, { color: colors.text }]}>SAVORIA</Text>
      <Text style={[styles.title, { color: colors.text }]}>Order Tracking</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        Your order status updates automatically.
      </Text>

      <View style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.orderLabel, { color: colors.secondaryText }]}>ORDER ID</Text>
        <Text style={[styles.orderId, { color: colors.text }]}>{order._id}</Text>
        <Text style={[styles.orderType, { color: colors.secondaryText }]}>
          Placed {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Status</Text>

        {STATUS_STEPS.map((status, index) => {
          const isCompleted = currentStep >= index;
          const isCurrent = order.status === status;

          return (
            <View key={status} style={styles.stepRow}>
              <View style={styles.timeline}>
                <View
                  style={[
                    styles.stepCircle,
                    { backgroundColor: isCompleted ? colors.primary : colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepCheck,
                      { color: isCompleted ? colors.primaryText : colors.secondaryText },
                    ]}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </Text>
                </View>
                {index < STATUS_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: currentStep > index ? colors.primary : colors.border },
                    ]}
                  />
                )}
              </View>

              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: isCompleted ? colors.text : colors.secondaryText }]}>
                  {status}
                </Text>
                <Text style={[styles.stepDescription, { color: colors.secondaryText }]}>
                  {status === "Pending" && "Your order has been received."}
                  {status === "Preparing" && "The restaurant is preparing your food."}
                  {status === "Ready" && "Your order is ready."}
                  {status === "Served" && "Your order has been served."}
                </Text>
                {isCurrent && (
                  <Text style={[styles.currentLabel, { color: colors.primary }]}>
                    Current Status
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {order.status === "Cancelled" && (
          <View style={[styles.cancelledBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Text style={[styles.cancelledTitle, { color: colors.text }]}>Order Cancelled</Text>
            <Text style={[styles.cancelledText, { color: colors.secondaryText }]}>
              This order has been cancelled.
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.timerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.timerLabel, { color: colors.secondaryText }]}>ELAPSED TIME</Text>
        <Text style={[styles.timer, { color: colors.text }]}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Items</Text>
        {order.items.map((item, index) => (
          <View key={`${item.menuItem}-${index}`} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemQuantity, { color: colors.secondaryText }]}>
                {item.quantity} × Rs. {item.price.toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.itemTotal, { color: colors.text }]}>
              Rs. {(item.price * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Server Total</Text>
          <Text style={[styles.total, { color: colors.text }]}>
            Rs. {order.totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace("/explore")}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>Back to Menu</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  brand: { fontSize: 13, fontWeight: "900", letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 30, fontWeight: "900" },
  subtitle: { fontSize: 14, marginTop: 7, marginBottom: 20 },
  orderCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 },
  orderLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  orderId: { fontSize: 16, fontWeight: "900", marginTop: 5 },
  orderType: { fontSize: 12, marginTop: 6 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 16 },
  sectionTitle: { fontSize: 19, fontWeight: "900", marginBottom: 18 },
  stepRow: { flexDirection: "row", minHeight: 75 },
  timeline: { width: 38, alignItems: "center" },
  stepCircle: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  stepCheck: { fontSize: 12, fontWeight: "900" },
  line: { width: 2, flex: 1, marginVertical: 2 },
  stepInfo: { flex: 1, paddingLeft: 12, paddingBottom: 12 },
  stepTitle: { fontSize: 15, fontWeight: "800" },
  stepDescription: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  currentLabel: { fontSize: 10, fontWeight: "900", marginTop: 5 },
  cancelledBox: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 5 },
  cancelledTitle: { fontSize: 15, fontWeight: "900" },
  cancelledText: { fontSize: 12, marginTop: 4 },
  timerCard: { borderWidth: 1, borderRadius: 20, padding: 20, alignItems: "center", marginBottom: 16 },
  timerLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  timer: { fontSize: 32, fontWeight: "900", marginTop: 5 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  itemInfo: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 14, fontWeight: "800" },
  itemQuantity: { fontSize: 12, marginTop: 4 },
  itemTotal: { fontSize: 14, fontWeight: "900" },
  divider: { height: 1, marginVertical: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 18, fontWeight: "900" },
  total: { fontSize: 20, fontWeight: "900" },
  button: { borderRadius: 15, paddingVertical: 17, alignItems: "center" },
  buttonText: { fontSize: 15, fontWeight: "900" },
  backButton: { marginTop: 18, padding: 10 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 24, fontWeight: "900", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 21, marginTop: 12, marginBottom: 24 },
});