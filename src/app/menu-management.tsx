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

import { useTheme } from "@/context/ThemeContext";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
};

const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Crispy Chicken Wings",
    price: 850,
    category: "Starters",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Loaded Fries",
    price: 550,
    category: "Starters",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Chicken Nuggets",
    price: 600,
    category: "Starters",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Chicken Biryani",
    price: 750,
    category: "Mains",
    isAvailable: true,
  },
  {
    id: "9",
    name: "Chicken Steak",
    price: 1250,
    category: "Mains",
    isAvailable: true,
  },
  {
    id: "10",
    name: "Chocolate Cake",
    price: 650,
    category: "Desserts",
    isAvailable: true,
  },
  {
    id: "14",
    name: "Fresh Lemonade",
    price: 350,
    category: "Drinks",
    isAvailable: true,
  },
];

export default function MenuManagementScreen() {
  const { colors } = useTheme();

  const [menu, setMenu] =
    useState<MenuItem[]>(initialMenu);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const toggleAvailability = (itemId: string) => {
    setMenu((previousMenu) =>
      previousMenu.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isAvailable: !item.isAvailable,
            }
          : item
      )
    );
  };

  const startEditing = (item: MenuItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditCategory(item.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditCategory("");
  };

  const saveEdit = () => {
    if (!editingId) {
      return;
    }

    if (!editName.trim()) {
      Alert.alert(
        "Invalid Name",
        "Please enter a menu item name."
      );
      return;
    }

    if (!editPrice.trim()) {
      Alert.alert(
        "Invalid Price",
        "Please enter a price."
      );
      return;
    }

    const numericPrice = Number(editPrice);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      Alert.alert(
        "Invalid Price",
        "Please enter a valid price."
      );
      return;
    }

    if (!editCategory.trim()) {
      Alert.alert(
        "Invalid Category",
        "Please enter a category."
      );
      return;
    }

    setMenu((previousMenu) =>
      previousMenu.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: editName.trim(),
              price: numericPrice,
              category: editCategory.trim(),
            }
          : item
      )
    );

    cancelEditing();

    Alert.alert(
      "Updated",
      "Menu item has been updated successfully."
    );
  };

  const deleteItem = (itemId: string) => {
    const item = menu.find(
      (menuItem) => menuItem.id === itemId
    );

    if (!item) {
      return;
    }

    Alert.alert(
      "Delete Menu Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenu((previousMenu) =>
              previousMenu.filter(
                (menuItem) =>
                  menuItem.id !== itemId
              )
            );
          },
        },
      ]
    );
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
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.backText,
              { color: colors.text },
            ]}
          >
            ‹
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
            Manage restaurant menu
          </Text>
        </View>
      </View>

      {/* MENU LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {menu.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              No Menu Items
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: colors.secondaryText },
              ]}
            >
              There are currently no menu items.
            </Text>
          </View>
        ) : (
          menu.map((item) => {
            const isEditing =
              editingId === item.id;

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {isEditing ? (
                  <>
                    <Text
                      style={[
                        styles.editTitle,
                        { color: colors.text },
                      ]}
                    >
                      Edit Menu Item
                    </Text>

                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.secondaryText },
                      ]}
                    >
                      NAME
                    </Text>

                    <TextInput
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Item name"
                      placeholderTextColor={
                        colors.secondaryText
                      }
                      style={[
                        styles.input,
                        {
                          backgroundColor:
                            colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.secondaryText },
                      ]}
                    >
                      PRICE
                    </Text>

                    <TextInput
                      value={editPrice}
                      onChangeText={setEditPrice}
                      placeholder="Price"
                      placeholderTextColor={
                        colors.secondaryText
                      }
                      keyboardType="numeric"
                      style={[
                        styles.input,
                        {
                          backgroundColor:
                            colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.secondaryText },
                      ]}
                    >
                      CATEGORY
                    </Text>

                    <TextInput
                      value={editCategory}
                      onChangeText={setEditCategory}
                      placeholder="Category"
                      placeholderTextColor={
                        colors.secondaryText
                      }
                      style={[
                        styles.input,
                        {
                          backgroundColor:
                            colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                    />

                    <View style={styles.editActions}>
                      <Pressable
                        onPress={saveEdit}
                        style={({ pressed }) => [
                          styles.saveButton,
                          {
                            backgroundColor:
                              colors.primary,
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.saveText,
                            {
                              color:
                                colors.primaryText,
                            },
                          ]}
                        >
                          Save Changes
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={cancelEditing}
                        style={({ pressed }) => [
                          styles.cancelButton,
                          {
                            backgroundColor:
                              colors.background,
                            borderColor:
                              colors.border,
                          },
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.cancelText,
                            { color: colors.text },
                          ]}
                        >
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    {/* ITEM INFORMATION */}
                    <View style={styles.cardTop}>
                      <View style={styles.info}>
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
                            styles.category,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {item.category}
                        </Text>

                        <Text
                          style={[
                            styles.price,
                            {
                              color: colors.primary,
                            },
                          ]}
                        >
                          Rs.{" "}
                          {item.price.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.rightSide}>
                        <View
                          style={[
                            styles.statusBadge,
                            item.isAvailable
                              ? styles.available
                              : styles.unavailable,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              item.isAvailable
                                ? styles.availableText
                                : styles.unavailableText,
                            ]}
                          >
                            {item.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() =>
                            toggleAvailability(
                              item.id
                            )
                          }
                          style={({ pressed }) => [
                            styles.toggleButton,
                            {
                              backgroundColor:
                                colors.primary,
                            },
                            pressed &&
                              styles.pressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              {
                                color:
                                  colors.primaryText,
                              },
                            ]}
                          >
                            {item.isAvailable
                              ? "Disable"
                              : "Enable"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() =>
                          startEditing(item)
                        }
                        style={({ pressed }) => [
                          styles.editButton,
                          {
                            backgroundColor:
                              colors.background,
                            borderColor:
                              colors.border,
                          },
                          pressed &&
                            styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.editButtonText,
                            { color: colors.text },
                          ]}
                        >
                          ✏ Edit
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          deleteItem(item.id)
                        }
                        style={({ pressed }) => [
                          styles.deleteButton,
                          pressed &&
                            styles.pressed,
                        ]}
                      >
                        <Text
                          style={
                            styles.deleteButtonText
                          }
                        >
                          🗑 Delete
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            );
          })
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

  headerTextContainer: {
    flex: 1,
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
    paddingBottom: 40,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    flex: 1,
    paddingRight: 12,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },

  category: {
    fontSize: 12,
    marginBottom: 7,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
  },

  rightSide: {
    alignItems: "flex-end",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 9,
  },

  available: {
    backgroundColor: "#E4F7EA",
  },

  unavailable: {
    backgroundColor: "#FDE7E7",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  availableText: {
    color: "#267A3D",
  },

  unavailableText: {
    color: "#B33A3A",
  },

  toggleButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
  },

  toggleText: {
    fontSize: 11,
    fontWeight: "800",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  editButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FDE7E7",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#B33A3A",
    fontSize: 12,
    fontWeight: "800",
  },

  editTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 14,
  },

  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 3,
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "800",
  },

  emptyCard: {
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },

  emptyText: {
    fontSize: 13,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});