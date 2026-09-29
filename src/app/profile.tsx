import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.center}>
          <Text style={[styles.message, { color: colors.text }]}>
            Please log in to view your profile.
          </Text>

          <Pressable
            style={[
              styles.loginButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => router.replace("/login")}
          >
            <Text
              style={[
                styles.loginButtonText,
                { color: colors.primaryText },
              ]}
            >
              Go to Login
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.brand, { color: colors.secondaryText }]}>
          SAVORIA
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          My Profile
        </Text>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: colors.primaryText },
              ]}
            >
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            {user.name}
          </Text>

          <Text
            style={[
              styles.email,
              { color: colors.secondaryText },
            ]}
          >
            {user.email}
          </Text>

          <View
            style={[
              styles.roleBadge,
              { borderColor: colors.border },
            ]}
          >
            <Text style={[styles.roleText, { color: colors.text }]}>
              {user.role === "manager" ? "Manager" : "Customer"}
            </Text>
          </View>
        </View>

        {/* Theme Setting */}
        <View
          style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.settingInfo}>
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text },
              ]}
            >
              Dark Mode
            </Text>

            <Text
              style={[
                styles.settingSubtitle,
                { color: colors.secondaryText },
              ]}
            >
              {isDark
                ? "Dark theme is enabled"
                : "Light theme is enabled"}
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>

        {/* Logout */}
        <Pressable
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.text }]}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  brand: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 24,
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "800",
  },

  name: {
    fontSize: 23,
    fontWeight: "800",
  },

  email: {
    fontSize: 14,
    marginTop: 5,
  },

  roleBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },

  roleText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  settingCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  settingSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 18,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "800",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  message: {
    fontSize: 17,
    marginBottom: 20,
  },

  loginButton: {
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  loginButtonText: {
    fontWeight: "800",
  },
});
