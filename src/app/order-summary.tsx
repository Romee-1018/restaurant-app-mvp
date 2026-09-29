import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useTheme } from "@/context/ThemeContext";

const SERVICE_CHARGE_RATE = 0.05;
const SALES_TAX_RATE = 0.15;

export default function OrderSummaryScreen() {
  const { state, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { colors } = useTheme();

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const summary = useMemo(() => {
    const subtotal = state.items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    const serviceCharge =
      subtotal * SERVICE_CHARGE_RATE;

    const salesTax =
      subtotal * SALES_TAX_RATE;

    const discount =
      subtotal * (state.discountPercent / 100);

    const grandTotal =
      subtotal +
      serviceCharge +
      salesTax -
      discount;

    return {
      subtotal,
      serviceCharge,
      salesTax,
      discount,
      grandTotal,
    };
  }, [
    state.items,
    state.discountPercent,
  ]);

  const handlePlaceOrder = () => {
    if (isPlacingOrder) {
      return;
    }

    if (state.items.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add some items before placing an order."
      );
      return;
    }

    setIsPlacingOrder(true);

    const orderItems = state.items.map(
      (item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        note: item.note,
      })
    );

    createOrder({
      items: orderItems,
      total: summary.grandTotal,
      type: "Takeaway",
    });

    setTimeout(() => {
      setIsPlacingOrder(false);

      clearCart();

      router.replace("/order-tracking");
    }, 800);
  };

  /* EMPTY CART */

  if (state.items.length === 0) {
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
          🛒
        </Text>

        <Text
          style={[
            styles.emptyTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Your Cart is Empty
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
          Add some delicious items from
          our menu first.
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
            Go to Menu
          </Text>
        </Pressable>
      </View>
    );
  }

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
        Order Summary
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
        Review your order before
        placing it.
      </Text>

      {/* ITEMS */}

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

        {state.items.map((item) => (
          <View
            key={item.id}
            style={styles.itemRow}
          >
            <View
              style={styles.itemInfo}
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

              {item.note ? (
                <Text
                  style={[
                    styles.note,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Note: {item.note}
                </Text>
              ) : null}
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
      </View>

      {/* PRICE DETAILS */}

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
          Price Details
        </Text>

        <View
          style={styles.summaryRow}
        >
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Subtotal
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Rs.{" "}
            {summary.subtotal.toLocaleString()}
          </Text>
        </View>

        <View
          style={styles.summaryRow}
        >
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Service Charge (5%)
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Rs.{" "}
            {summary.serviceCharge.toLocaleString()}
          </Text>
        </View>

        <View
          style={styles.summaryRow}
        >
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Sales Tax (15%)
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Rs.{" "}
            {summary.salesTax.toLocaleString()}
          </Text>
        </View>

        {state.discountPercent >
          0 && (
          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={[
                styles.label,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Promo Discount (
              {state.discountPercent}
              %)
            </Text>

            <Text
              style={styles.discount}
            >
              - Rs.{" "}
              {summary.discount.toLocaleString()}
            </Text>
          </View>
        )}

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
              styles.grandTotalLabel,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Grand Total
          </Text>

          <Text
            style={[
              styles.grandTotal,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Rs.{" "}
            {summary.grandTotal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* BACK TO CART */}

      <Pressable
        onPress={() => router.back()}
        disabled={isPlacingOrder}
        style={[
          styles.secondaryButton,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
            opacity:
              isPlacingOrder
                ? 0.5
                : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.secondaryButtonText,
            {
              color:
                colors.text,
            },
          ]}
        >
          ← Back to Cart
        </Text>
      </Pressable>

      {/* PLACE ORDER */}

      <Pressable
        onPress={handlePlaceOrder}
        disabled={isPlacingOrder}
        style={[
          styles.button,
          {
            backgroundColor:
              colors.primary,
            opacity:
              isPlacingOrder
                ? 0.7
                : 1,
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
          {isPlacingOrder
            ? "Placing Order..."
            : "Place Order"}
        </Text>
      </Pressable>

      <Text
        style={[
          styles.footerText,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        By placing this order, you
        confirm your order details.
      </Text>
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
    fontWeight: "800",
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
    marginBottom: 24,
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
    marginBottom: 16,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    paddingVertical: 11,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "800",
  },

  itemQuantity: {
    fontSize: 12,
    marginTop: 5,
  },

  note: {
    fontSize: 11,
    marginTop: 5,
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: "900",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
  },

  discount: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  grandTotalLabel: {
    fontSize: 20,
    fontWeight: "900",
  },

  grandTotal: {
    fontSize: 22,
    fontWeight: "900",
  },

  secondaryButton: {
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
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

  footerText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 17,
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