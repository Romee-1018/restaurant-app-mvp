import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useForm } from "@/hooks/useForm";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { login } = useAuth();
  const { isDark, colors } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(35)
  ).current;

  const validateLogin = (
    values: LoginFormValues
  ) => {
    const validationErrors: Record<
      string,
      string
    > = {};

    if (!values.email.trim()) {
      validationErrors.email =
        "Please enter your email.";
    } else if (!values.email.includes("@")) {
      validationErrors.email =
        "Please enter a valid email.";
    }

    if (!values.password) {
      validationErrors.password =
        "Please enter your password.";
    } else if (
      values.password.length < 8 ||
      !/\d/.test(values.password)
    ) {
      validationErrors.password =
        "Password must be at least 8 characters and contain a digit.";
    }

    return validationErrors;
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(
    {
      email: "",
      password: "",
    },
    validateLogin
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    handleSubmit(
      async (formValues: Record<string, string>) => {
        setLoading(true);

        const loggedInUser = await login(
          formValues.email.trim(),
          formValues.password
        );

        setLoading(false);

        if (!loggedInUser) {
          Alert.alert(
            "Login Failed",
            "Invalid email or password."
          );

          return;
        }

        if (
          loggedInUser.role === "manager"
        ) {
          router.replace(
            "/manager-dashboard"
          );
        } else {
          router.replace("/explore");
        }
      }
    );
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? [
              "#121212",
              "#1A1714",
              "#0D0D0D",
            ]
          : [
              "#F8F6F2",
              "#EFEAE2",
              "#E5DED4",
            ]
      }
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            {/* BACK BUTTON */}

            <Pressable
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.06)",
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

            {/* LOGO */}

            <View
              style={[
                styles.logoCircle,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text style={styles.logo}>
                🍽️
              </Text>
            </View>

            {/* BRAND */}

            <Text
              style={[
                styles.brand,
                {
                  color: colors.primary,
                },
              ]}
            >
              SAVORIA
            </Text>

            {/* TITLE */}

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Welcome back
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
              Sign in to continue your dining
              experience.
            </Text>

            {/* EMAIL */}

            <View
              style={styles.inputContainer}
            >
              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                EMAIL
              </Text>

              <TextInput
                value={values.email}
                onChangeText={(text) =>
                  handleChange(
                    "email",
                    text
                  )
                }
                placeholder="you@example.com"
                placeholderTextColor={
                  colors.placeholder
                }
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    borderColor:
                      errors.email
                        ? "#F87171"
                        : colors.border,

                    backgroundColor:
                      colors.input,

                    color: colors.text,
                  },
                ]}
              />

              {errors.email ? (
                <Text
                  style={styles.errorText}
                >
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* PASSWORD */}

            <View
              style={styles.inputContainer}
            >
              <View
                style={styles.passwordHeader}
              >
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  PASSWORD
                </Text>

                <Pressable
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  <Text
                    style={[
                      styles.showText,
                      {
                        color:
                          colors.primary,
                      },
                    ]}
                  >
                    {showPassword
                      ? "HIDE"
                      : "SHOW"}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                value={values.password}
                onChangeText={(text) =>
                  handleChange(
                    "password",
                    text
                  )
                }
                placeholder="Enter your password"
                placeholderTextColor={
                  colors.placeholder
                }
                secureTextEntry={
                  !showPassword
                }
                style={[
                  styles.input,
                  {
                    borderColor:
                      errors.password
                        ? "#F87171"
                        : colors.border,

                    backgroundColor:
                      colors.input,

                    color: colors.text,
                  },
                ]}
              />

              {errors.password ? (
                <Text
                  style={styles.errorText}
                >
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* LOGIN BUTTON */}

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.loginButton,

                {
                  backgroundColor:
                    colors.primary,
                },

                pressed &&
                  styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  color={
                    colors.primaryText
                  }
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.loginButtonText,
                      {
                        color:
                          colors.primaryText,
                      },
                    ]}
                  >
                    Sign In
                  </Text>

                  <Text
                    style={[
                      styles.arrow,
                      {
                        color:
                          colors.primaryText,
                      },
                    ]}
                  >
                    →
                  </Text>
                </>
              )}
            </Pressable>

            {/* SIGNUP */}

            <View
              style={styles.signupRow}
            >
              <Text
                style={[
                  styles.signupText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Don't have an account?
              </Text>

              <Pressable
                onPress={() =>
                  router.push("/signup")
                }
              >
                <Text
                  style={[
                    styles.signupLink,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  {" "}
                  Create account
                </Text>
              </Pressable>
            </View>
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

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
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
    marginBottom: 22,
  },

  backText: {
    fontSize: 32,
    lineHeight: 32,
    marginTop: -3,
  },

  logoCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logo: {
    fontSize: 30,
  },

  brand: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 18,
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 17,
    fontSize: 15,
  },

  showText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  errorText: {
    color: "#F87171",
    fontSize: 13,
    marginTop: 7,
  },

  loginButton: {
    height: 57,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 12,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  signupText: {
    fontSize: 13,
  },

  signupLink: {
    fontSize: 13,
    fontWeight: "800",
  },
});