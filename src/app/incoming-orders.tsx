import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  OrderStatus,
  useOrders,
} from "@/context/OrdersContext";
import { useTheme } from "@/context/ThemeContext";

export default function IncomingOrdersScreen() {
  const { orders, updateOrderStatus } = useOrders();
  const { colors } = useTheme();

  const handleManage = (
    orderId: string,
    status: OrderStatus
  ) => {
    if (status === "Pending") {
      updateOrderStatus(orderId, "Preparing");
      return;
    }

    if (status === "Preparing") {
      updateOrderStatus(orderId, "Ready");
      return;
    }

    if (status === "Ready") {
      updateOrderStatus(orderId, "Served");
    }
  };

  const getButtonText = (status: OrderStatus) => {
    if (status === "Pending") {
      return "Start Preparing";
    }

    if (status === "Preparing") {
      return "Mark Ready";
    }

    if (status === "Ready") {
      return "Mark Served";
    }

    if (status === "Served") {
      return "Served";
    }

    return "Cancelled";
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.backText,
              {
                color: colors.text,
              },
            ]}
          >
            ‹
          </Text>
        </Pressable>

        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Incoming Orders
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Manage customer orders
          </Text>
        </View>
      </View>

      {/* ORDERS */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {orders.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.emptyIcon}>📦</Text>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Incoming Orders
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              New customer orders will appear
              here.
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* CARD HEADER */}

              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.orderId,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {order.id}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    order.status === "Pending" &&
                      styles.pending,
                    order.status === "Preparing" &&
                      styles.preparing,
                    order.status === "Ready" &&
                      styles.ready,
                    order.status === "Served" &&
                      styles.served,
                    order.status === "Cancelled" &&
                      styles.cancelled,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* ORDER TYPE */}

              <Text
                style={[
                  styles.orderType,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {order.type}
              </Text>

              {/* ITEMS */}

              <View style={styles.itemsContainer}>
                {order.items.map((item) => (
                  <View
                    key={item.id}
                    style={styles.itemRow}
                  >
                    <Text
                      style={[
                        styles.itemName,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={[
                        styles.itemQuantity,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      × {item.quantity}
                    </Text>
                  </View>
                ))}
              </View>

              {/* TOTAL + ACTION */}

              <View style={styles.bottomRow}>
                <Text
                  style={[
                    styles.total,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Rs.{" "}
                  {order.total.toLocaleString()}
                </Text>

                {order.status !== "Served" &&
                order.status !== "Cancelled" ? (
                  <Pressable
                    onPress={() =>
                      handleManage(
                        order.id,
                        order.status
                      )
                    }
                    style={({ pressed }) => [
                      styles.manageButton,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                      pressed &&
                        styles.manageButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.manageText,
                        {
                          color:
                            colors.primaryText,
                        },
                      ]}
                    >
                      {getButtonText(
                        order.status
                      )}
                    </Text>
                  </Pressable>
                ) : (
                  <View
                    style={[
                      styles.completedButton,
                      order.status ===
                        "Cancelled" &&
                        styles.cancelledButton,
                    ]}
                  >
                    <Text
                      style={
                        order.status ===
                        "Cancelled"
                          ? styles.cancelledButtonText
                          : styles.completedButtonText
                      }
                    >
                      {order.status ===
                      "Cancelled"
                        ? "✕ Cancelled"
                        : "✓ Served"}
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
  },

  orderId: {
    fontSize: 15,
    fontWeight: "800",
  },

  orderType: {
    fontSize: 12,
    marginBottom: 14,
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
  },

  total: {
    fontSize: 16,
    fontWeight: "800",
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