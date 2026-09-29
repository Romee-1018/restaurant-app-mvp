import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function SignupScreen() {
  const { signup } = useAuth();
  const { isDark, colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<"customer" | "manager">(
    "customer"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const clearError = () => {
    if (error) {
      setError("");
    }
  };

  const handleSignup = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      setError(
        "Password must be at least 8 characters and contain a digit."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const success = await signup(
      name.trim(),
      email.trim(),
      password,
      role
    );

    setLoading(false);

    if (!success) {
      setError("An account with this email already exists.");
      return;
    }

    router.replace("/login");
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#17120D", "#24180F", "#0F0C09"]
          : ["#F8F6F2", "#EFEAE2", "#E5DED4"]
      }
      style={styles.container}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.06)",
                },
                pressed && styles.smallPressed,
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

            {/* Logo */}
            <View
              style={[
                styles.logoCircle,
                {
                  backgroundColor: "#D97706",
                },
              ]}
            >
              <Text style={styles.logo}>🍽️</Text>
            </View>

            <Text
              style={[
                styles.brand,
                {
                  color: "#F59E0B",
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
              Create account
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Join Savoria and discover your next favorite meal.
            </Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                FULL NAME
              </Text>

              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  clearError();
                }}
                placeholder="Your name"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="words"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.055)"
                      : "rgba(255,255,255,0.65)",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                EMAIL
              </Text>

              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                placeholder="you@example.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.055)"
                      : "rgba(255,255,255,0.65)",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  PASSWORD
                </Text>

                <Pressable
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <Text
                    style={[
                      styles.showText,
                      {
                        color: "#F59E0B",
                      },
                    ]}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
                placeholder="Create a password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.055)"
                      : "rgba(255,255,255,0.65)",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  CONFIRM PASSWORD
                </Text>

                <Pressable
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  <Text
                    style={[
                      styles.showText,
                      {
                        color: "#F59E0B",
                      },
                    ]}
                  >
                    {showConfirmPassword ? "HIDE" : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError();
                }}
                placeholder="Repeat your password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.055)"
                      : "rgba(255,255,255,0.65)",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* Role */}
            <View style={styles.roleSection}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                ACCOUNT TYPE
              </Text>

              <View style={styles.roleRow}>
                {/* Customer */}
                <Pressable
                  onPress={() => {
                    setRole("customer");
                    clearError();
                  }}
                  style={[
                    styles.roleButton,
                    {
                      borderColor:
                        role === "customer"
                          ? "#D97706"
                          : colors.border,
                      backgroundColor:
                        role === "customer"
                          ? "rgba(217,119,6,0.12)"
                          : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.55)",
                    },
                  ]}
                >
                  <Text style={styles.roleIcon}>🍽️</Text>

                  <View style={styles.roleTextContainer}>
                    <Text
                      style={[
                        styles.roleTitle,
                        {
                          color:
                            role === "customer"
                              ? "#F59E0B"
                              : colors.text,
                        },
                      ]}
                    >
                      Customer
                    </Text>

                    <Text
                      style={[
                        styles.roleDescription,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      Browse & order
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor:
                          role === "customer"
                            ? "#F59E0B"
                            : colors.secondaryText,
                      },
                    ]}
                  >
                    {role === "customer" && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </Pressable>

                {/* Manager */}
                <Pressable
                  onPress={() => {
                    setRole("manager");
                    clearError();
                  }}
                  style={[
                    styles.roleButton,
                    {
                      borderColor:
                        role === "manager"
                          ? "#D97706"
                          : colors.border,
                      backgroundColor:
                        role === "manager"
                          ? "rgba(217,119,6,0.12)"
                          : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.55)",
                    },
                  ]}
                >
                  <Text style={styles.roleIcon}>👨‍💼</Text>

                  <View style={styles.roleTextContainer}>
                    <Text
                      style={[
                        styles.roleTitle,
                        {
                          color:
                            role === "manager"
                              ? "#F59E0B"
                              : colors.text,
                        },
                      ]}
                    >
                      Manager
                    </Text>

                    <Text
                      style={[
                        styles.roleDescription,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      Manage restaurant
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor:
                          role === "manager"
                            ? "#F59E0B"
                            : colors.secondaryText,
                      },
                    ]}
                  >
                    {role === "manager" && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>!</Text>

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Signup Button */}
            <Pressable
              onPress={handleSignup}
              disabled={loading}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && !loading && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#1C1309" />

                  <Text style={styles.loadingText}>
                    Creating account...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.signupButtonText}>
                    Create Account
                  </Text>

                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </Pressable>

            {/* Login */}
            <View style={styles.loginRow}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Already have an account?
              </Text>

              <Pressable
                onPress={() => router.replace("/login")}
              >
                <Text
                  style={[
                    styles.loginLink,
                    {
                      color: "#F59E0B",
                    },
                  ]}
                >
                  {" "}Sign In
                </Text>
              </Pressable>
            </View>

            <Text
              style={[
                styles.footer,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Your table. Your taste. Your experience.
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  glowTop: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#D97706",
    opacity: 0.07,
    top: -100,
    right: -80,
  },

  glowBottom: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F59E0B",
    opacity: 0.05,
    bottom: -70,
    left: -80,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 35,
    paddingBottom: 35,
  },

  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  smallPressed: {
    transform: [{ scale: 0.94 }],
  },

  backText: {
    fontSize: 32,
    lineHeight: 32,
    marginTop: -3,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  logo: {
    fontSize: 29,
  },

  brand: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },

  inputContainer: {
    marginBottom: 15,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 7,
  },

  showText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  input: {
    height: 53,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },

  roleSection: {
    marginTop: 2,
    marginBottom: 15,
  },

  roleRow: {
    gap: 10,
  },

  roleButton: {
    minHeight: 67,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  roleIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  roleTextContainer: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  roleDescription: {
    fontSize: 11,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F59E0B",
  },

  errorBox: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "rgba(248,113,113,0.09)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F87171",
    color: "#1C1309",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "900",
    marginRight: 9,
  },

  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    flex: 1,
  },

  signupButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  signupButtonText: {
    color: "#1C1309",
    fontSize: 15,
    fontWeight: "800",
  },

  loadingText: {
    color: "#1C1309",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },

  arrow: {
    color: "#1C1309",
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 12,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    fontSize: 13,
  },

  loginLink: {
    fontSize: 13,
    fontWeight: "800",
  },

  footer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 18,
  },
});