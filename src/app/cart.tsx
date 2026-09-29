import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

export default function CartScreen() {
  const {
    state,
    increment,
    decrement,
    removeItem,
    updateNote,
    applyPromo,
    removePromo,
    clearCart,
  } = useCart();

  const { colors } = useTheme();

  const [promoInput, setPromoInput] = useState("");

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount =
    subtotal * (state.discountPercent / 100);

  const total = subtotal - discount;

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      Alert.alert(
        "Promo Code",
        "Please enter a promo code."
      );
      return;
    }

    applyPromo(promoInput);
    setPromoInput("");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCart,
        },
      ]
    );
  };

  if (state.items.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Pressable
          onPress={() => router.push("/explore")}
          style={[
            styles.emptyBackButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyBackButtonText,
              { color: colors.text },
            ]}
          >
            ← Menu
          </Text>
        </Pressable>

        <View
          style={[
            styles.emptyIconCircle,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.emptyIcon}>🛒</Text>
        </View>

        <Text
          style={[
            styles.emptyTitle,
            { color: colors.text },
          ]}
        >
          Your Cart is Empty
        </Text>

        <Text
          style={[
            styles.emptyText,
            { color: colors.secondaryText },
          ]}
        >
          Your delicious journey starts here.
          Explore our menu and add something
          you love.
        </Text>

        <Pressable
          onPress={() => router.push("/explore")}
          style={[
            styles.emptyExploreButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.emptyExploreText,
              { color: colors.primaryText },
            ]}
          >
            Explore Menu
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.brand,
                { color: colors.primary },
              ]}
            >
              SAVORIA
            </Text>

            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                Your Cart
              </Text>

              <View
                style={[
                  styles.itemCountBadge,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.itemCountText,
                    { color: colors.primaryText },
                  ]}
                >
                  {totalItems}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.subtitle,
                { color: colors.secondaryText },
              ]}
            >
              Review your delicious selection
            </Text>
          </View>

          <Pressable
            onPress={handleClearCart}
            style={({ pressed }) => [
              styles.clearButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.clearIcon}>🗑</Text>

            <Text
              style={[
                styles.clearButtonText,
                { color: colors.text },
              ]}
            >
              Clear
            </Text>
          </Pressable>
        </View>

        {/* BACK TO MENU */}
        <Pressable
          onPress={() => router.push("/explore")}
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
              styles.backButtonText,
              { color: colors.text },
            ]}
          >
            ← Continue Shopping
          </Text>
        </Pressable>

        {/* CART ITEMS */}
        {state.items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.itemCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.itemTop}>
              <View style={styles.itemIconBox}>
                <Text style={styles.itemIcon}>🍽️</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemName,
                    { color: colors.text },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.itemCategory,
                    { color: colors.secondaryText },
                  ]}
                >
                  {item.category}
                </Text>

                <Text
                  style={[
                    styles.itemPrice,
                    { color: colors.primary },
                  ]}
                >
                  Rs. {item.price.toLocaleString()}
                </Text>
              </View>

              <Pressable
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeIcon}>
                  ×
                </Text>
              </Pressable>
            </View>

            {/* QUANTITY */}
            <View style={styles.quantitySection}>
              <Text
                style={[
                  styles.quantityLabel,
                  { color: colors.secondaryText },
                ]}
              >
                Quantity
              </Text>

              <View
                style={[
                  styles.stepper,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.input,
                  },
                ]}
              >
                <Pressable
                  onPress={() => decrement(item.id)}
                  style={styles.stepButton}
                >
                  <Text
                    style={[
                      styles.stepText,
                      { color: colors.text },
                    ]}
                  >
                    −
                  </Text>
                </Pressable>

                <Text
                  style={[
                    styles.quantity,
                    { color: colors.text },
                  ]}
                >
                  {item.quantity}
                </Text>

                <Pressable
                  onPress={() => increment(item.id)}
                  style={styles.stepButton}
                >
                  <Text
                    style={[
                      styles.stepText,
                      { color: colors.text },
                    ]}
                  >
                    +
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* NOTE */}
            <TextInput
              value={item.note}
              onChangeText={(text) =>
                updateNote(item.id, text)
              }
              placeholder="Add a special request..."
              placeholderTextColor={colors.placeholder}
              multiline
              style={[
                styles.noteInput,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            {/* ITEM TOTAL */}
            <View
              style={[
                styles.itemTotalRow,
                {
                  borderTopColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.itemTotalLabel,
                  { color: colors.secondaryText },
                ]}
              >
                Item Total
              </Text>

              <Text
                style={[
                  styles.itemTotal,
                  { color: colors.text },
                ]}
              >
                Rs.{" "}
                {(
                  item.price * item.quantity
                ).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}

        {/* PROMO */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeadingRow}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: colors.input },
              ]}
            >
              <Text>🎁</Text>
            </View>

            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                ]}
              >
                Have a promo code?
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.secondaryText },
                ]}
              >
                Save more on your order
              </Text>
            </View>
          </View>

          <View style={styles.promoRow}>
            <TextInput
              value={promoInput}
              onChangeText={setPromoInput}
              placeholder="Enter promo code"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
              style={[
                styles.promoInput,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            <Pressable
              onPress={handleApplyPromo}
              style={[
                styles.applyButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.applyButtonText,
                  { color: colors.primaryText },
                ]}
              >
                Apply
              </Text>
            </Pressable>
          </View>

          {state.promoError ? (
            <Text style={styles.errorText}>
              {state.promoError}
            </Text>
          ) : null}

          {state.promoCode ? (
            <View
              style={[
                styles.appliedPromoRow,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.appliedPromo,
                  { color: colors.text },
                ]}
              >
                ✓ {state.promoCode} •{" "}
                {state.discountPercent}% off
              </Text>

              <Pressable onPress={removePromo}>
                <Text style={styles.removePromo}>
                  Remove
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* SUMMARY */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryTitle,
              { color: colors.text },
            ]}
          >
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                { color: colors.secondaryText },
              ]}
            >
              Subtotal
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: colors.text },
              ]}
            >
              Rs. {subtotal.toLocaleString()}
            </Text>
          </View>

          {state.discountPercent > 0 ? (
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: colors.secondaryText },
                ]}
              >
                Discount ({state.discountPercent}%)
              </Text>

              <Text style={styles.discountValue}>
                − Rs. {discount.toLocaleString()}
              </Text>
            </View>
          ) : null}

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.border },
            ]}
          />

          <View style={styles.totalRow}>
            <View>
              <Text
                style={[
                  styles.totalLabel,
                  { color: colors.text },
                ]}
              >
                Total
              </Text>

              <Text
                style={[
                  styles.totalSmall,
                  { color: colors.secondaryText },
                ]}
              >
                Including applicable discount
              </Text>
            </View>

            <Text
              style={[
                styles.totalValue,
                { color: colors.primary },
              ]}
            >
              Rs. {total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* CHECKOUT */}
        <Pressable
          onPress={() =>
            router.push("/order-summary")
          }
          style={({ pressed }) => [
            styles.checkoutButton,
            {
              backgroundColor: colors.primary,
            },
            pressed && styles.checkoutPressed,
          ]}
        >
          <View>
            <Text
              style={[
                styles.checkoutText,
                { color: colors.primaryText },
              ]}
            >
              Continue to Order
            </Text>

            <Text
              style={[
                styles.checkoutSubtext,
                { color: colors.primaryText },
              ]}
            >
              Review your order details
            </Text>
          </View>

          <Text
            style={[
              styles.checkoutArrow,
              { color: colors.primaryText },
            ]}
          >
            →
          </Text>
        </Pressable>

        <Text
          style={[
            styles.bottomNote,
            { color: colors.secondaryText },
          ]}
        >
          🔒 Your order details are handled securely
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },

  brand: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 5,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
  },

  itemCountBadge: {
    minWidth: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
    paddingHorizontal: 7,
  },

  itemCountText: {
    fontSize: 11,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 5,
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  clearIcon: {
    fontSize: 13,
    marginRight: 5,
  },

  clearButtonText: {
    fontSize: 11,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginBottom: 17,
  },

  backButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },

  itemCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  itemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  itemIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F5EFE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemIcon: {
    fontSize: 22,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },

  itemName: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 3,
  },

  itemCategory: {
    fontSize: 11,
    marginBottom: 7,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "900",
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFF1EF",
    alignItems: "center",
    justifyContent: "center",
  },

  removeIcon: {
    color: "#C0392B",
    fontSize: 21,
    lineHeight: 22,
  },

  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },

  quantityLabel: {
    fontSize: 12,
    fontWeight: "700",
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  stepButton: {
    width: 39,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  stepText: {
    fontSize: 21,
    fontWeight: "500",
  },

  quantity: {
    width: 34,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "900",
  },

  noteInput: {
    minHeight: 43,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 14,
    fontSize: 12,
  },

  itemTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 13,
  },

  itemTotalLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: "900",
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    marginBottom: 14,
  },

  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  promoRow: {
    flexDirection: "row",
    gap: 9,
  },

  promoInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  applyButton: {
    height: 45,
    borderRadius: 11,
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    fontSize: 12,
    fontWeight: "900",
  },

  errorText: {
    color: "#C0392B",
    fontSize: 11,
    marginTop: 8,
  },

  appliedPromoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 11,
  },

  appliedPromo: {
    fontSize: 11,
    fontWeight: "800",
  },

  removePromo: {
    color: "#C0392B",
    fontSize: 11,
    fontWeight: "800",
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  summaryLabel: {
    fontSize: 13,
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  discountValue: {
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    marginVertical: 7,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
  },

  totalSmall: {
    fontSize: 9,
    marginTop: 3,
  },

  totalValue: {
    fontSize: 21,
    fontWeight: "900",
  },

  checkoutButton: {
    minHeight: 64,
    borderRadius: 17,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },

  checkoutPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  checkoutText: {
    fontSize: 15,
    fontWeight: "900",
  },

  checkoutSubtext: {
    fontSize: 9,
    marginTop: 3,
    opacity: 0.8,
  },

  checkoutArrow: {
    fontSize: 27,
    fontWeight: "700",
  },

  bottomNote: {
    textAlign: "center",
    fontSize: 9,
    marginTop: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyBackButton: {
    position: "absolute",
    top: 58,
    left: 20,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  emptyBackButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },

  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 310,
    marginBottom: 23,
  },

  emptyExploreButton: {
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },

  emptyExploreText: {
    fontSize: 13,
    fontWeight: "900",
  },
});