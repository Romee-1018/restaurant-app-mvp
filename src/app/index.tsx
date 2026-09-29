import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  return (
    <LinearGradient
      colors={["#17120D", "#24180F", "#0F0C09"]}
      style={styles.container}
    >
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

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
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🍽️</Text>
        </View>

        <Text style={styles.brand}>SAVORIA</Text>

        <Text style={styles.heading}>
          Good food.
        </Text>

        <Text style={styles.headingAccent}>
          Great moments.
        </Text>

        <Text style={styles.description}>
          Discover delicious meals, explore our menu,
          and enjoy a better dining experience.
        </Text>

        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🍔</Text>
            <Text style={styles.featureText}>Fresh Food</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Fast Service</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>❤️</Text>
            <Text style={styles.featureText}>Great Taste</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Text style={styles.footer}>
          Your table. Your taste. Your experience.
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#D97706",
    opacity: 0.08,
    top: -70,
    right: -70,
  },

  glowTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#F59E0B",
    opacity: 0.06,
    bottom: -40,
    left: -50,
  },

  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#D97706",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  logo: {
    fontSize: 42,
  },

  brand: {
    color: "#F59E0B",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 28,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: width > 380 ? 42 : 36,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -1,
  },

  headingAccent: {
    color: "#F59E0B",
    fontSize: width > 380 ? 42 : 36,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 18,
  },

  description: {
    color: "#B8AEA3",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 340,
    marginBottom: 28,
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 360,
    marginBottom: 34,
  },

  feature: {
    alignItems: "center",
    flex: 1,
  },

  featureIcon: {
    fontSize: 22,
    marginBottom: 7,
  },

  featureText: {
    color: "#AFA69D",
    fontSize: 11,
    fontWeight: "600",
  },

  button: {
    width: "100%",
    maxWidth: 360,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  buttonText: {
    color: "#1C1309",
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    color: "#1C1309",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
  },

  footer: {
    color: "#6F665E",
    fontSize: 11,
    marginTop: 22,
  },
});