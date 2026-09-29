import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

export default function OrderConfirmationScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.content}>
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

        <View
          style={[
            styles.successCircle,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.check,
              {
                color: colors.primaryText,
              },
            ]}
          >
            ✓
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Order Placed!
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Your order has been received successfully.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Thank you for ordering with Savoria!
          </Text>

          <Text
            style={[
              styles.cardText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Your order is now being prepared by the
            restaurant.
          </Text>

          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusLabel,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              ORDER STATUS
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: colors.text,
                },
              ]}
            >
              Pending
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.replace("/explore")}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: colors.primaryText,
              },
            ]}
          >
            Back to Menu
          </Text>
        </Pressable>
      </View>
    </View>
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
    paddingHorizontal: 24,
  },

  brand: {
    position: "absolute",
    top: 65,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
  },

  successCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  check: {
    fontSize: 52,
    fontWeight: "900",
    marginTop: -4,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  cardText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },

  statusBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 18,
    alignItems: "center",
  },

  statusLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  status: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 3,
  },

  button: {
    width: "100%",
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "900",
  },
});