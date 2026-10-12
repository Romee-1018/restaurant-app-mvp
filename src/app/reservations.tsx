import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
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
    loading,
    error,
    loadAllReservations,
    decideReservation,
  } = useReservation();

  const { colors } = useTheme();

  useEffect(() => {
    loadAllReservations();
  }, [loadAllReservations]);

  const handleDecision = async (
    id: string,
    status: "Accepted" | "Declined"
  ) => {
    const result = await decideReservation(id, status);
    if (!result.success) {
      Alert.alert("Could not update", result.message);
    }
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

      {/* LOADING / ERROR */}
      {loading && reservations.length === 0 && (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}

      {error !== "" && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && error === "" && reservations.length === 0 && (
        <Text
          style={[
            styles.emptyText,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          No reservations yet.
        </Text>
      )}

      {/* RESERVATIONS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {reservations.map((reservation) => (
          <View
            key={reservation._id}
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
                Table {reservation.table?.tableNumber ?? "-"}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  reservation.status === "Pending" && styles.pending,
                  reservation.status === "Accepted" && styles.confirmed,
                  reservation.status === "Declined" && styles.cancelled,
                ]}
              >
                <Text style={styles.statusText}>{reservation.status}</Text>
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
              Customer: {reservation.user?.name ?? "Unknown"}
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
                  onPress={() => handleDecision(reservation._id, "Accepted")}
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
                    Accept
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDecision(reservation._id, "Declined")}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.cancelText}>Decline</Text>
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

  loader: {
    marginTop: 30,
  },

  errorText: {
    color: "#B33A3A",
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 14,
    paddingHorizontal: 20,
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