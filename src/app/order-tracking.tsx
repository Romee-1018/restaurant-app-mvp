import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
];

const STATUS_TIMES: Record<
  OrderStatus,
  number
> = {
  Pending: 0,
  Preparing: 10,
  Ready: 20,
  Served: 30,
  Cancelled: 0,
};

export default function OrderTrackingScreen() {
  const { colors } = useTheme();
  const { orders, updateOrderStatus } = useOrders();

  const params = useLocalSearchParams<{
    orderId?: string;
  }>();

  const order = useMemo(() => {
    if (!params.orderId) {
      return orders[orders.length - 1];
    }

    return orders.find(
      (item) => item.id === params.orderId
    );
  }, [orders, params.orderId]);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  /*
   * Running elapsed time counter.
   *
   * The interval is cleared when the screen
   * unmounts so that no timer continues running.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * Automatic order status progression.
   *
   * Pending   -> Preparing after 10 seconds
   * Preparing -> Ready after 20 seconds
   * Ready     -> Served after 30 seconds
   */
  useEffect(() => {
    if (!order) {
      return;
    }

    if (
      order.status === "Cancelled" ||
      order.status === "Served"
    ) {
      return;
    }

    const interval = setInterval(() => {
      const currentElapsed = Math.floor(
        (Date.now() -
          new Date(order.timestamp).getTime()) /
          1000
      );

      if (
        currentElapsed >= 30 &&
        order.status !== "Served"
      ) {
        updateOrderStatus(
          order.id,
          "Served"
        );
      } else if (
        currentElapsed >= 20 &&
        order.status !== "Ready"
      ) {
        updateOrderStatus(
          order.id,
          "Ready"
        );
      } else if (
        currentElapsed >= 10 &&
        order.status !== "Preparing"
      ) {
        updateOrderStatus(
          order.id,
          "Preparing"
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    order,
    updateOrderStatus,
  ]);

  if (!order) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyIcon,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          📦
        </Text>

        <Text
          style={[
            styles.emptyTitle,
            {
              color: colors.text,
            },
          ]}
        >
          No Order Found
        </Text>

        <Text
          style={[
            styles.emptyText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          We could not find an order to
          track.
        </Text>

        <Pressable
          onPress={() =>
            router.replace("/explore")
          }
          style={[
            styles.button,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            Back to Menu
          </Text>
        </Pressable>
      </View>
    );
  }

  const currentStep =
    STATUS_STEPS.indexOf(order.status);

  const displayElapsed = Math.max(
    elapsedSeconds,
    Math.floor(
      (Date.now() -
        new Date(order.timestamp).getTime()) /
        1000
    )
  );

  const minutes = Math.floor(
    displayElapsed / 60
  );

  const seconds =
    displayElapsed % 60;

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <Text
        style={[
          styles.brand,
          {
            color: colors.text,
          },
        ]}
      >
        SAVORIA
      </Text>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Order Tracking
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        Your order is being prepared.
      </Text>

      {/* ORDER ID */}

      <View
        style={[
          styles.orderCard,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.orderLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          ORDER ID
        </Text>

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

        <Text
          style={[
            styles.orderType,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {order.type}
          {order.table
            ? ` • Table ${order.table}`
            : ""}
          {order.pickupTime
            ? ` • Pickup ${order.pickupTime}`
            : ""}
        </Text>
      </View>

      {/* STATUS */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Order Status
        </Text>

        {STATUS_STEPS.map(
          (status, index) => {
            const isCompleted =
              currentStep >= index;

            const isCurrent =
              order.status === status;

            return (
              <View
                key={status}
                style={
                  styles.stepRow
                }
              >
                <View
                  style={
                    styles.timeline
                  }
                >
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor:
                          isCompleted
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCheck,
                        {
                          color:
                            isCompleted
                              ? colors.primaryText
                              : colors.secondaryText,
                        },
                      ]}
                    >
                      {isCompleted
                        ? "✓"
                        : index + 1}
                    </Text>
                  </View>

                  {index <
                    STATUS_STEPS.length -
                      1 && (
                    <View
                      style={[
                        styles.line,
                        {
                          backgroundColor:
                            currentStep >
                            index
                              ? colors.primary
                              : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>

                <View
                  style={
                    styles.stepInfo
                  }
                >
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color:
                          isCompleted
                            ? colors.text
                            : colors.secondaryText,
                      },
                    ]}
                  >
                    {status}
                  </Text>

                  <Text
                    style={[
                      styles.stepDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {status ===
                      "Pending" &&
                      "Your order has been received."}

                    {status ===
                      "Preparing" &&
                      "The restaurant is preparing your food."}

                    {status ===
                      "Ready" &&
                      "Your order is ready."}

                    {status ===
                      "Served" &&
                      "Your order has been served."}
                  </Text>

                  {isCurrent && (
                    <Text
                      style={[
                        styles.currentLabel,
                        {
                          color:
                            colors.primary,
                        },
                      ]}
                    >
                      Current Status
                    </Text>
                  )}
                </View>
              </View>
            );
          }
        )}

        {order.status ===
          "Cancelled" && (
          <View
            style={[
              styles.cancelledBox,
              {
                borderColor:
                  colors.border,
                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.cancelledTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Order Cancelled
            </Text>

            <Text
              style={[
                styles.cancelledText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              This order has been
              cancelled.
            </Text>
          </View>
        )}
      </View>

      {/* ELAPSED TIME */}

      <View
        style={[
          styles.timerCard,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.timerLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          ELAPSED TIME
        </Text>

        <Text
          style={[
            styles.timer,
            {
              color: colors.text,
            },
          ]}
        >
          {String(minutes).padStart(
            2,
            "0"
          )}
          :
          {String(seconds).padStart(
            2,
            "0"
          )}
        </Text>
      </View>

      {/* ORDER ITEMS */}

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Your Items
        </Text>

        {order.items.map((item) => (
          <View
            key={item.id}
            style={styles.itemRow}
          >
            <View
              style={
                styles.itemInfo
              }
            >
              <Text
                style={[
                  styles.itemName,
                  {
                    color:
                      colors.text,
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
                {item.quantity} × Rs.{" "}
                {item.price.toLocaleString()}
              </Text>
            </View>

            <Text
              style={[
                styles.itemTotal,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Rs.{" "}
              {(
                item.price *
                item.quantity
              ).toLocaleString()}
            </Text>
          </View>
        ))}

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.border,
            },
          ]}
        />

        <View
          style={styles.totalRow}
        >
          <Text
            style={[
              styles.totalLabel,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Total
          </Text>

          <Text
            style={[
              styles.total,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Rs.{" "}
            {order.total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* BUTTON */}

      <Pressable
        onPress={() =>
          router.replace("/explore")
        }
        style={[
          styles.button,
          {
            backgroundColor:
              colors.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                colors.primaryText,
            },
          ]}
        >
          Back to Menu
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 50,
  },

  brand: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 7,
    marginBottom: 20,
  },

  orderCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  orderLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  orderId: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 5,
  },

  orderType: {
    fontSize: 13,
    marginTop: 6,
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 18,
  },

  stepRow: {
    flexDirection: "row",
    minHeight: 75,
  },

  timeline: {
    width: 38,
    alignItems: "center",
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  stepCheck: {
    fontSize: 12,
    fontWeight: "900",
  },

  line: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },

  stepInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 12,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  currentLabel: {
    fontSize: 10,
    fontWeight: "900",
    marginTop: 5,
  },

  cancelledBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 5,
  },

  cancelledTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  cancelledText: {
    fontSize: 12,
    marginTop: 4,
  },

  timerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },

  timerLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  timer: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 5,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "800",
  },

  itemQuantity: {
    fontSize: 12,
    marginTop: 4,
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
  },

  total: {
    fontSize: 20,
    fontWeight: "900",
  },

  button: {
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "900",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
});