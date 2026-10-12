import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useReservation } from "@/hooks/useReservation";

function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export default function MyReservationsScreen() {
  const { colors } = useTheme();

  const {
    reservations,
    tables,
    loading,
    error,
    timeSlots,
    loadMyReservations,
    loadTables,
    createReservation,
  } = useReservation();

  const [date, setDate] = useState(todayString());
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [tableId, setTableId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Poll every 10 seconds so the customer sees Accepted/Declined without restarting
  useEffect(() => {
    loadMyReservations();
    const id = setInterval(loadMyReservations, 10000);
    return () => clearInterval(id);
  }, [loadMyReservations]);

  // Ask the server which tables are free at this date and time
  useEffect(() => {
    setTableId("");
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && time) {
      loadTables(date, time);
    }
  }, [date, time, loadTables]);

  const handleBook = async () => {
    setSubmitting(true);
    const result = await createReservation({ date, time, guests, tableId });
    setSubmitting(false);

    if (result.success) {
      Alert.alert("Requested", "Your booking is waiting for the manager.");
      setTableId("");
      loadMyReservations();
      loadTables(date, time);
      return;
    }

    // A1 style quick errors first, otherwise the server message (for example 409)
    const firstError = Object.values(result.errors)[0] as string | undefined;
    Alert.alert("Could not book", firstError || result.message);
  };

  const text = { color: colors.text };
  const subText = { color: colors.secondaryText };
  const input = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.backText, text]}>‹</Text>
        </Pressable>

        <View>
          <Text style={[styles.title, text]}>My Reservations</Text>
          <Text style={[styles.subtitle, subText]}>
            Book a table and track your bookings
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* BOOKING FORM */}
        <Text style={[styles.sectionTitle, text]}>Book a table</Text>

        <Text style={[styles.label, subText]}>Date (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="2026-10-20"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          style={[styles.input, input]}
        />

        <Text style={[styles.label, subText]}>Time</Text>
        <View style={styles.chipRow}>
          {timeSlots.map((slot) => {
            const selected = slot === time;
            return (
              <Pressable
                key={slot}
                onPress={() => setTime(slot)}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  selected && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    text,
                    selected && { color: colors.primaryText },
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, subText]}>Guests</Text>
        <View style={styles.guestRow}>
          <Pressable
            onPress={() => setGuests((g) => Math.max(1, g - 1))}
            style={[
              styles.stepButton,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.stepText, text]}>−</Text>
          </Pressable>

          <Text style={[styles.guestCount, text]}>{guests}</Text>

          <Pressable
            onPress={() => setGuests((g) => Math.min(12, g + 1))}
            style={[
              styles.stepButton,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.stepText, text]}>+</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, subText]}>Table</Text>
        {!time ? (
          <Text style={[styles.hint, subText]}>
            Select a time to see the tables.
          </Text>
        ) : (
          <View style={styles.chipRow}>
            {tables.map((table) => {
              const tooSmall = table.seats < guests;
              const disabled = !table.available || tooSmall;
              const selected = table._id === tableId;
              return (
                <Pressable
                  key={table._id}
                  disabled={disabled}
                  onPress={() => setTableId(table._id)}
                  style={[
                    styles.tableChip,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    selected && { backgroundColor: colors.primary },
                    disabled && styles.disabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      text,
                      selected && { color: colors.primaryText },
                    ]}
                  >
                    Table {table.tableNumber} · {table.seats} seats
                  </Text>
                  {disabled && (
                    <Text style={styles.disabledText}>
                      {!table.available ? "Booked" : "Too small"}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={handleBook}
          disabled={submitting}
          style={({ pressed }) => [
            styles.bookButton,
            { backgroundColor: colors.primary },
            (pressed || submitting) && styles.pressed,
          ]}
        >
          <Text style={[styles.bookText, { color: colors.primaryText }]}>
            {submitting ? "Booking..." : "Request booking"}
          </Text>
        </Pressable>

        {/* MY BOOKINGS */}
        <Text style={[styles.sectionTitle, text, styles.listTitle]}>
          My bookings
        </Text>

        {loading && reservations.length === 0 && (
          <ActivityIndicator color={colors.primary} />
        )}

        {error !== "" && <Text style={styles.errorText}>{error}</Text>}

        {!loading && error === "" && reservations.length === 0 && (
          <Text style={[styles.hint, subText]}>No bookings yet.</Text>
        )}

        {reservations.map((reservation) => (
          <View
            key={reservation._id}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, text]}>
                Table {reservation.table?.tableNumber ?? "-"}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  reservation.status === "Pending" && styles.pending,
                  reservation.status === "Accepted" && styles.accepted,
                  reservation.status === "Declined" && styles.declined,
                ]}
              >
                <Text style={styles.statusText}>{reservation.status}</Text>
              </View>
            </View>

            <Text style={[styles.details, subText]}>
              {reservation.date} at {reservation.time}
            </Text>
            <Text style={[styles.details, subText]}>
              Guests: {reservation.guests}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
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
  backText: { fontSize: 32, lineHeight: 34, marginTop: -4 },
  title: { fontSize: 25, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 3 },

  content: { paddingHorizontal: 20, paddingBottom: 40 },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 10 },
  listTitle: { marginTop: 28, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  hint: { fontSize: 14 },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { fontSize: 13, fontWeight: "700" },

  tableChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  disabled: { opacity: 0.45 },
  disabledText: { fontSize: 11, color: "#B33A3A", fontWeight: "700" },

  guestRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { fontSize: 22, fontWeight: "700", marginTop: -2 },
  guestCount: { fontSize: 20, fontWeight: "800", minWidth: 28, textAlign: "center" },

  bookButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  bookText: { fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.7 },

  errorText: { color: "#B33A3A", fontSize: 14, fontWeight: "700" },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  details: { fontSize: 14, marginBottom: 4 },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  pending: { backgroundColor: "#FFF0D6" },
  accepted: { backgroundColor: "#E4F7EA" },
  declined: { backgroundColor: "#FDE7E7" },
  statusText: { fontSize: 11, fontWeight: "800", color: "#333" },
});