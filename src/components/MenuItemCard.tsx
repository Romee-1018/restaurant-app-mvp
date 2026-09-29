import { memo } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSpecial: boolean;
  isAvailable: boolean;
};

type MenuItemCardProps = {
  item: MenuItem;
  quantity: number;
  isFavorite: boolean;
  onAddToCart: (item: MenuItem) => void;
  onToggleFavorite: (id: string) => void;
};

function MenuItemCard({
  item,
  quantity,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: MenuItemCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: item.isAvailable ? 1 : 0.6,
        },
      ]}
    >
      {/* Food Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Special Badge */}
        {item.isSpecial && (
          <View style={styles.specialBadge}>
            <Text style={styles.specialEmoji}>⭐</Text>

            <Text style={styles.specialText}>
              SPECIAL
            </Text>
          </View>
        )}

        {/* Availability */}
        {!item.isAvailable && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>
              CURRENTLY UNAVAILABLE
            </Text>
          </View>
        )}

        {/* Favorite */}
        <Pressable
          onPress={() => onToggleFavorite(item.id)}
          style={({ pressed }) => [
            styles.favoriteButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            pressed && styles.favoritePressed,
          ]}
          hitSlop={8}
        >
          <Text
            style={[
              styles.favoriteIcon,
              {
                color: isFavorite
                  ? "#C9953C"
                  : colors.secondaryText,
              },
            ]}
          >
            {isFavorite ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <Text
          style={[
            styles.category,
            { color: colors.primary },
          ]}
        >
          {item.category.toUpperCase()}
        </Text>

        {/* Name */}
        <Text
          style={[
            styles.name,
            { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        {/* Description */}
        <Text
          style={[
            styles.description,
            { color: colors.secondaryText },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* Bottom */}
        <View style={styles.bottomRow}>
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.priceLabel,
                { color: colors.secondaryText },
              ]}
            >
              PRICE
            </Text>

            <Text
              style={[
                styles.price,
                { color: colors.text },
              ]}
            >
              Rs. {item.price.toLocaleString()}
            </Text>

            {quantity > 0 && (
              <View
                style={[
                  styles.cartQuantity,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quantityText,
                    { color: colors.primary },
                  ]}
                >
                  🛒 {quantity} in cart
                </Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          <Pressable
            disabled={!item.isAvailable}
            onPress={() => onAddToCart(item)}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: item.isAvailable
                  ? colors.primary
                  : colors.border,
              },
              pressed &&
                item.isAvailable &&
                styles.addPressed,
            ]}
          >
            <Text
              style={[
                styles.addButtonText,
                {
                  color: item.isAvailable
                    ? colors.primaryText
                    : colors.secondaryText,
                },
              ]}
            >
              {item.isAvailable ? "+ Add" : "Unavailable"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 3,
  },

  imageContainer: {
    width: "100%",
    height: 205,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  specialBadge: {
    position: "absolute",
    left: 12,
    top: 12,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#C9953C",

    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 20,
  },

  specialEmoji: {
    fontSize: 11,
    marginRight: 4,
  },

  specialText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  unavailableBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,

    backgroundColor: "rgba(30, 30, 30, 0.82)",

    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 8,
  },

  unavailableText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,

    width: 42,
    height: 42,

    borderRadius: 21,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.12,
    shadowRadius: 5,

    elevation: 3,
  },

  favoritePressed: {
    transform: [{ scale: 0.9 }],
  },

  favoriteIcon: {
    fontSize: 24,
    lineHeight: 27,
  },

  content: {
    padding: 17,
  },

  category: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 6,
  },

  name: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 7,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    minHeight: 40,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 17,
  },

  priceContainer: {
    flex: 1,
    paddingRight: 10,
  },

  priceLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
  },

  cartQuantity: {
    alignSelf: "flex-start",

    borderWidth: 1,
    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 5,

    marginTop: 7,
  },

  quantityText: {
    fontSize: 9,
    fontWeight: "800",
  },

  addButton: {
    minWidth: 86,

    borderRadius: 13,

    paddingHorizontal: 16,
    paddingVertical: 12,

    alignItems: "center",
    justifyContent: "center",
  },

  addPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "900",
  },
});

export default memo(MenuItemCard);