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

import { useMenu } from "@/context/MenuContext";
import { useTheme } from "@/context/ThemeContext";

export default function MenuManagement() {
  const { colors } = useTheme();

  const {
    menuItems,
    isLoading,
    error,
    toggleAvailability,
    updateMenuItem,
    deleteMenuItem,
  } = useMenu();

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const startEditing = (item: {
    id: string;
    name: string;
    price: number;
    category: string;
  }) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(String(item.price));
    setEditCategory(item.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditCategory("");
  };

  const saveEdit = async () => {
    if (!editingId) {
      return;
    }

    const cleanName = editName.trim();
    const cleanCategory = editCategory.trim();
    const numericPrice = Number(editPrice);

    if (!cleanName) {
      Alert.alert("Error", "Item name is required.");
      return;
    }

    if (!editPrice.trim() || Number.isNaN(numericPrice)) {
      Alert.alert("Error", "Please enter a valid price.");
      return;
    }

    if (numericPrice < 0) {
      Alert.alert(
        "Error",
        "Price cannot be negative."
      );
      return;
    }

    if (!cleanCategory) {
      Alert.alert("Error", "Category is required.");
      return;
    }

    const success = await updateMenuItem(
      editingId,
      cleanName,
      numericPrice,
      cleanCategory
    );

    if (success) {
      Alert.alert(
        "Success",
        "Menu item updated successfully."
      );
      cancelEditing();
    } else {
      Alert.alert(
        "Error",
        "Failed to update menu item."
      );
    }
  };

  const handleToggleAvailability = async (
    id: string,
    currentAvailability: boolean
  ) => {
    const success = await toggleAvailability(
      id,
      !currentAvailability
    );

    if (!success) {
      Alert.alert(
        "Error",
        "Failed to update availability."
      );
    }
  };

  const deleteItem = (id: string, name: string) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteMenuItem(id);

            if (success) {
              Alert.alert(
                "Success",
                "Menu item deleted successfully."
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to delete menu item."
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.loadingText,
            { color: colors.text },
          ]}
        >
          Loading menu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            { color: colors.text },
          ]}
        >
          {error}
        </Text>

        <Pressable
          onPress={() => router.replace("/manager-dashboard")}
          style={[
            styles.backButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
              { color: colors.primaryText },
            ]}
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/manager-dashboard")}
          style={[
            styles.backIconButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.backIcon,
              { color: colors.text },
            ]}
          >
            ←
          </Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            Menu Management
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText },
            ]}
          >
            Manage prices, items and availability
          </Text>
        </View>
      </View>

      {/* Menu Count */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.summaryLabel,
              { color: colors.secondaryText },
            ]}
          >
            Total Menu Items
          </Text>

          <Text
            style={[
              styles.summaryNumber,
              { color: colors.text },
            ]}
          >
            {menuItems.length}
          </Text>
        </View>

        <Text style={styles.summaryEmoji}>🍔</Text>
      </View>

      {/* Menu Items */}
      {menuItems.map((item) => (
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
          {/* Item Header */}
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleContainer}>
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
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: item.isAvailable
                    ? "#E4F7EA"
                    : "#FDE8E8",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: item.isAvailable
                      ? "#2D8A43"
                      : "#C0392B",
                  },
                ]}
              >
                {item.isAvailable
                  ? "AVAILABLE"
                  : "UNAVAILABLE"}
              </Text>
            </View>
          </View>

          {/* Edit Form */}
          {editingId === item.id ? (
            <View style={styles.editContainer}>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Item name"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />

              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                placeholder="Price"
                placeholderTextColor="#999"
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />

              <TextInput
                value={editCategory}
                onChangeText={setEditCategory}
                placeholder="Category"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />

              <View style={styles.editButtons}>
                <Pressable
                  onPress={saveEdit}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.saveButtonText,
                      {
                        color:
                          colors.primaryText,
                      },
                    ]}
                  >
                    Save
                  </Text>
                </Pressable>

                <Pressable
                  onPress={cancelEditing}
                  style={[
                    styles.cancelButton,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: colors.text },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Price */}
              <Text
                style={[
                  styles.price,
                  { color: colors.primary },
                ]}
              >
                Rs. {item.price.toLocaleString()}
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    handleToggleAvailability(
                      item.id,
                      item.isAvailable
                    )
                  }
                  style={[
                    styles.actionButton,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: colors.text },
                    ]}
                  >
                    {item.isAvailable
                      ? "Disable"
                      : "Enable"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    startEditing(item)
                  }
                  style={[
                    styles.actionButton,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: colors.text },
                    ]}
                  >
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    deleteItem(
                      item.id,
                      item.name
                    )
                  }
                  style={[
                    styles.deleteButton,
                    {
                      backgroundColor:
                        "#FDE8E8",
                    },
                  ]}
                >
                  <Text
                    style={styles.deleteButtonText}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ))}

      {menuItems.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: colors.secondaryText },
            ]}
          >
            No menu items found.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 45,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 20,
  },

  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    fontSize: 13,
    fontWeight: "800",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backIcon: {
    fontSize: 22,
    fontWeight: "700",
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  summaryNumber: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 3,
  },

  summaryEmoji: {
    fontSize: 30,
  },

  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 13,
  },

  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  itemTitleContainer: {
    flex: 1,
    marginRight: 10,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "900",
  },

  itemCategory: {
    fontSize: 11,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  price: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 15,
    marginBottom: 14,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },

  actionButtonText: {
    fontSize: 11,
    fontWeight: "800",
  },

  deleteButton: {
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  deleteButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#C0392B",
  },

  editContainer: {
    marginTop: 15,
  },

  input: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 9,
  },

  editButtons: {
    flexDirection: "row",
    marginTop: 3,
  },

  saveButton: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },

  saveButtonText: {
    fontSize: 11,
    fontWeight: "800",
  },

  cancelButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  cancelButtonText: {
    fontSize: 11,
    fontWeight: "800",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 35,
  },

  emptyText: {
    fontSize: 13,
  },
});