import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useTheme } from "@/context/ThemeContext";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { colors } = useTheme();

  if (!user || user.role !== "manager") {
    return (
      <View
        style={[
          styles.deniedContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.deniedIcon,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={styles.deniedEmoji}>🔒</Text>
        </View>

        <Text
          style={[
            styles.deniedTitle,
            { color: colors.text },
          ]}
        >
          Access Denied
        </Text>

        <Text
          style={[
            styles.deniedText,
            { color: colors.secondaryText },
          ]}
        >
          Manager access is required to view this dashboard.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backHomeButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.backHomeText,
              { color: colors.primaryText },
            ]}
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const todaySales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + order.total, 0);

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
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>

          <View>
            <Text
              style={[
                styles.brand,
                { color: colors.primary },
              ]}
            >
              SAVORIA
            </Text>

            <Text
              style={[
                styles.managerLabel,
                { color: colors.secondaryText },
              ]}
            >
              MANAGER PANEL
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={[
            styles.exitButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.exitEmoji,
              { color: colors.text },
            ]}
          >
            ↩
          </Text>
        </Pressable>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <Text
          style={[
            styles.greeting,
            { color: colors.secondaryText },
          ]}
        >
          Good evening 👋
        </Text>

        <Text
          style={[
            styles.welcomeTitle,
            { color: colors.text },
          ]}
        >
          Welcome, {user.name}
        </Text>

        <Text
          style={[
            styles.welcomeSubtitle,
            { color: colors.secondaryText },
          ]}
        >
          Here’s what’s happening in your restaurant today.
        </Text>
      </View>

      {/* Restaurant Status */}
      <View
        style={[
          styles.restaurantStatus,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.statusLeft}>
          <View style={styles.onlineDot} />

          <View>
            <Text
              style={[
                styles.statusTitle,
                { color: colors.text },
              ]}
            >
              Restaurant is Open
            </Text>

            <Text
              style={[
                styles.statusSubtitle,
                { color: colors.secondaryText },
              ]}
            >
              Accepting orders now
            </Text>
          </View>
        </View>

        <Text style={styles.openText}>OPEN</Text>
      </View>

      {/* Today's Overview */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Today’s Overview
      </Text>

      <View style={styles.statsGrid}>
        {/* Pending Orders */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statIcon}>
            <Text style={styles.statEmoji}>🛎️</Text>
          </View>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {pendingOrders}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.secondaryText },
            ]}
          >
            Pending Orders
          </Text>
        </View>

        {/* Preparing */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statIcon}>
            <Text style={styles.statEmoji}>🍳</Text>
          </View>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {preparingOrders}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.secondaryText },
            ]}
          >
            Preparing
          </Text>
        </View>

        {/* Sales */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statIcon}>
            <Text style={styles.statEmoji}>💰</Text>
          </View>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {todaySales.toLocaleString()}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.secondaryText },
            ]}
          >
            Today’s Sales
          </Text>
        </View>

        {/* Menu Items */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statIcon}>
            <Text style={styles.statEmoji}>🍔</Text>
          </View>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            16
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.secondaryText },
            ]}
          >
            Menu Items
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Quick Actions
        </Text>

        <Text
          style={[
            styles.sectionHint,
            { color: colors.secondaryText },
          ]}
        >
          Manage
        </Text>
      </View>

      {/* Incoming Orders */}
      <Pressable
        onPress={() => router.push("/incoming-orders")}
        style={({ pressed }) => [
          styles.actionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.actionIcon,
            { backgroundColor: "#FFF0D6" },
          ]}
        >
          <Text style={styles.actionEmoji}>📦</Text>
        </View>

        <View style={styles.actionInfo}>
          <Text
            style={[
              styles.actionTitle,
              { color: colors.text },
            ]}
          >
            Incoming Orders
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              { color: colors.secondaryText },
            ]}
          >
            View and manage customer orders
          </Text>
        </View>

        <Text
          style={[
            styles.actionArrow,
            { color: colors.primary },
          ]}
        >
          →
        </Text>
      </Pressable>

      {/* Reservations */}
      <Pressable
        onPress={() => router.push("/reservations")}
        style={({ pressed }) => [
          styles.actionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.actionIcon,
            { backgroundColor: "#E6F0FF" },
          ]}
        >
          <Text style={styles.actionEmoji}>📅</Text>
        </View>

        <View style={styles.actionInfo}>
          <Text
            style={[
              styles.actionTitle,
              { color: colors.text },
            ]}
          >
            Reservations
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              { color: colors.secondaryText },
            ]}
          >
            Manage restaurant reservations
          </Text>
        </View>

        <Text
          style={[
            styles.actionArrow,
            { color: colors.primary },
          ]}
        >
          →
        </Text>
      </Pressable>

      {/* Menu Management */}
      <Pressable
        onPress={() => router.push("/menu-management")}
        style={({ pressed }) => [
          styles.actionCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.actionIcon,
            { backgroundColor: "#E4F7EA" },
          ]}
        >
          <Text style={styles.actionEmoji}>🍔</Text>
        </View>

        <View style={styles.actionInfo}>
          <Text
            style={[
              styles.actionTitle,
              { color: colors.text },
            ]}
          >
            Menu Management
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              { color: colors.secondaryText },
            ]}
          >
            Edit prices, items and availability
          </Text>
        </View>

        <Text
          style={[
            styles.actionArrow,
            { color: colors.primary },
          ]}
        >
          →
        </Text>
      </Pressable>

      {/* Recent Activity */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Recent Activity
      </Text>

      <View
        style={[
          styles.activityCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {orders.length > 0 ? (
          orders
            .slice(-3)
            .reverse()
            .map((order, index) => (
              <View key={order.id}>
                <View style={styles.activityRow}>
                  <View style={styles.activityIcon}>
                    <Text>
                      {order.status === "Preparing"
                        ? "🍳"
                        : order.status === "Ready"
                        ? "✅"
                        : order.status === "Cancelled"
                        ? "❌"
                        : "🍛"}
                    </Text>
                  </View>

                  <View style={styles.activityInfo}>
                    <Text
                      style={[
                        styles.activityTitle,
                        { color: colors.text },
                      ]}
                    >
                      Order {order.status}
                    </Text>

                    <Text
                      style={[
                        styles.activitySubtitle,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      {order.id} • {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </Text>
                  </View>

                  <Text style={styles.activityTime}>
                    {order.status}
                  </Text>
                </View>

                {index < Math.min(orders.length, 3) - 1 && (
                  <View
                    style={[
                      styles.divider,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  />
                )}
              </View>
            ))
        ) : (
          <View style={styles.emptyActivity}>
            <Text
              style={[
                styles.emptyActivityText,
                { color: colors.secondaryText },
              ]}
            >
              No orders yet.
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            { color: colors.secondaryText },
          ]}
        >
          SAVORIA • Manager Dashboard
        </Text>

        <Text style={styles.footerEmoji}>✨</Text>
      </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoEmoji: {
    fontSize: 25,
  },

  brand: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },

  managerLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 3,
  },

  exitButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  exitEmoji: {
    fontSize: 22,
  },

  welcomeSection: {
    marginBottom: 22,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 5,
  },

  welcomeTitle: {
    fontSize: 31,
    fontWeight: "900",
    marginBottom: 7,
  },

  welcomeSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 350,
  },

  restaurantStatus: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  onlineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#39A852",
    marginRight: 11,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  statusSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  openText: {
    color: "#2D8A43",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 13,
  },

  sectionHint: {
    fontSize: 11,
    marginBottom: 13,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  statCard: {
    width: "48%",
    borderRadius: 17,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },

  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#F5EFE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  statEmoji: {
    fontSize: 18,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 3,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  actionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },

  actionIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  actionEmoji: {
    fontSize: 23,
  },

  actionInfo: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 11,
    lineHeight: 17,
  },

  actionArrow: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 8,
  },

  activityCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F5EFE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityInfo: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  activitySubtitle: {
    fontSize: 10,
    lineHeight: 15,
  },

  activityTime: {
    fontSize: 10,
    color: "#A87932",
    fontWeight: "800",
    marginLeft: 8,
  },

  divider: {
    height: 1,
  },

  emptyActivity: {
    paddingVertical: 22,
    alignItems: "center",
  },

  emptyActivityText: {
    fontSize: 12,
  },

  footer: {
    alignItems: "center",
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  footerEmoji: {
    fontSize: 12,
    marginLeft: 5,
  },

  deniedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  deniedIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  deniedEmoji: {
    fontSize: 32,
  },

  deniedTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },

  deniedText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 25,
  },

  backHomeButton: {
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 13,
  },

  backHomeText: {
    fontSize: 13,
    fontWeight: "800",
  },
});