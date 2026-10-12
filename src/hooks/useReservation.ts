import { useCallback, useState } from "react";

import { request } from "@/api/client";

// Server statuses
export type ReservationStatus = "Pending" | "Accepted" | "Declined";

export type TableInfo = {
  _id: string;
  tableNumber: number;
  seats: number;
  available: boolean;
};

export type Reservation = {
  _id: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  table?: { _id: string; tableNumber: number; seats: number } | null;
  user?: { _id?: string; name?: string; email?: string } | null;
};

export type CreateReservationPayload = {
  date: string;
  time: string;
  guests: number;
  tableId: string;
};

export type ReservationValidationErrors = {
  date?: string;
  time?: string;
  guests?: string;
  tableId?: string;
};

// Hourly slots from 12:00 to 22:00
const TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesFromNow(date: string, time: string) {
  const selected = new Date(`${date}T${time}:00`);
  return (selected.getTime() - Date.now()) / 60000;
}

export function useReservation() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Customer: own bookings
  const loadMyReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/api/reservations/my");
      setReservations(data);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manager: all bookings
  const loadAllReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/api/reservations");
      setReservations(data);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tables, with availability for a date and time
  const loadTables = useCallback(async (date?: string, time?: string) => {
    try {
      const query = date && time ? `?date=${date}&time=${time}` : "";
      const data = await request(`/api/tables${query}`);
      setTables(data);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  // Quick feedback only. The server check is the one that counts.
  const validateReservation = (
    data: CreateReservationPayload
  ): ReservationValidationErrors => {
    const errors: ReservationValidationErrors = {};

    if (!data.date) {
      errors.date = "Please select a date.";
    } else if (data.date < getTodayString()) {
      errors.date = "Reservation date cannot be in the past.";
    }

    if (!data.time) {
      errors.time = "Please select a time.";
    }

    if (
      !Number.isInteger(data.guests) ||
      data.guests < 1 ||
      data.guests > 12
    ) {
      errors.guests = "Party size must be between 1 and 12.";
    }

    if (!data.tableId) {
      errors.tableId = "Please select a table.";
    } else {
      const table = tables.find((t) => t._id === data.tableId);
      if (table && table.seats < data.guests) {
        errors.tableId = "Selected table does not have enough seats.";
      }
    }

    if (
      data.date &&
      data.time &&
      !errors.date &&
      minutesFromNow(data.date, data.time) < 60
    ) {
      errors.time = "Reservation must be at least one hour ahead.";
    }

    return errors;
  };

  // Customer: book a table
  const createReservation = async (data: CreateReservationPayload) => {
    const errors = validateReservation(data);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors, message: "" };
    }

    try {
      const reservation = await request("/api/reservations", {
        method: "POST",
        body: {
          table: data.tableId,
          date: data.date,
          time: data.time,
          guests: data.guests,
        },
      });
      return { success: true, errors: {}, message: "", reservation };
    } catch (e: any) {
      // Server message, for example the 409 "already booked"
      return { success: false, errors: {}, message: e.message };
    }
  };

  // Manager: Accepted or Declined
  const decideReservation = async (
    id: string,
    status: "Accepted" | "Declined"
  ) => {
    try {
      const updated = await request(`/api/reservations/${id}`, {
        method: "PATCH",
        body: { status },
      });
      setReservations((previous) =>
        previous.map((r) =>
          r._id === id ? { ...r, status: updated.status } : r
        )
      );
      return { success: true, message: "" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  return {
    reservations,
    tables,
    loading,
    error,
    timeSlots: TIME_SLOTS,
    loadMyReservations,
    loadAllReservations,
    loadTables,
    validateReservation,
    createReservation,
    decideReservation,
  };
}