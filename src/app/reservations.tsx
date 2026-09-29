import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useReservation } from "@/hooks/useReservation";

export default function ReservationsScreen() {
  const {
    reservations,
    confirmReservation,
    cancelReservation,
  } = useReservation();

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
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
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
              styles.backText,
              {
                color: colors.text,
              },
            ]}
          >
            ‹
          </Text>
        </Pressable>

        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Reservations
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Manage restaurant reservations
          </Text>
        </View>
      </View>

      {/* RESERVATIONS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {reservations.map((reservation) => (
          <View
            key={reservation.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* CARD HEADER */}
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.reservationId,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {reservation.id}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  reservation.status === "Pending" &&
                    styles.pending,
                  reservation.status === "Confirmed" &&
                    styles.confirmed,
                  reservation.status === "Cancelled" &&
                    styles.cancelled,
                ]}
              >
                <Text style={styles.statusText}>
                  {reservation.status}
                </Text>
              </View>
            </View>

            {/* CUSTOMER */}
            <Text
              style={[
                styles.customer,
                {
                  color: colors.text,
                },
              ]}
            >
              Customer: {reservation.customer}
            </Text>

            {/* DATE */}
            <Text
              style={[
                styles.details,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Date: {reservation.date}
            </Text>

            {/* TIME */}
            <Text
              style={[
                styles.details,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Time: {reservation.time}
            </Text>

            {/* GUESTS */}
            <Text
              style={[
                styles.details,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Guests: {reservation.guests}
            </Text>

            {/* ACTIONS */}
            {reservation.status === "Pending" && (
              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    confirmReservation(reservation.id)
                  }
                  style={({ pressed }) => [
                    styles.confirmButton,
                    {
                      backgroundColor: colors.primary,
                    },
                    pressed && styles.buttonPressed,
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
                    Confirm
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    cancelReservation(reservation.id)
                  }
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.cancelText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
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
    paddingBottom: 30,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  reservationId: {
    fontSize: 15,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  pending: {
    backgroundColor: "#FFF0D6",
  },

  confirmed: {
    backgroundColor: "#E4F7EA",
  },

  cancelled: {
    backgroundColor: "#FDE7E7",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#333",
  },

  customer: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  details: {
    fontSize: 14,
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#FDE7E7",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  buttonText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cancelText: {
    color: "#B33A3A",
    fontSize: 12,
    fontWeight: "800",
  },
});