import { useMemo, useState } from "react";

import mockReservations from "@/data/reservations";
import mockTables from "@/data/tables";

export type ReservationStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled";

export type Reservation = {
  id: string;
  customer: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  phone: string;
  status: ReservationStatus;
};

export type CreateReservationPayload = {
  customer: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  phone: string;
};

export type ReservationValidationErrors = {
  date?: string;
  time?: string;
  guests?: string;
  phone?: string;
  tableId?: string;
  customer?: string;
};

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

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTimeDifferenceInMinutes(
  date: string,
  time: string
) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const selectedDate = new Date(
    `${date}T${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:00`
  );

  return (
    (selectedDate.getTime() -
      Date.now()) /
    60000
  );
}

export function useReservation() {
  const [reservations, setReservations] =
    useState<Reservation[]>(
      mockReservations as Reservation[]
    );

  /*
   * Assignment requirement:
   * Hourly slots from 12:00 to 22:00.
   */
  const timeSlots = useMemo(
    () => TIME_SLOTS,
    []
  );

  /*
   * Check whether a table is already
   * booked for a particular date/time.
   */
  const isTableBooked = (
    tableId: string,
    date: string,
    time: string
  ) => {
    return reservations.some(
      (reservation) =>
        reservation.tableId === tableId &&
        reservation.date === date &&
        reservation.time === time &&
        reservation.status !==
          "Cancelled"
    );
  };

  /*
   * Return tables that have enough seats
   * and are free at the selected date/time.
   */
  const getAvailableTables = (
    date: string,
    time: string,
    guests: number
  ) => {
    return mockTables.filter(
      (table) =>
        table.seats >= guests &&
        !isTableBooked(
          table.id,
          date,
          time
        )
    );
  };

  /*
   * Used by the Reservation screen to
   * disable unavailable time slots.
   */
  const isTimeSlotAvailable = (
    date: string,
    time: string,
    guests: number
  ) => {
    return (
      getAvailableTables(
        date,
        time,
        guests
      ).length > 0
    );
  };

  /*
   * Validate reservation information.
   */
  const validateReservation = (
    data: CreateReservationPayload
  ): ReservationValidationErrors => {
    const errors: ReservationValidationErrors =
      {};

    if (!data.customer.trim()) {
      errors.customer =
        "Customer name is required.";
    }

    if (!data.date) {
      errors.date =
        "Please select a date.";
    } else {
      const today = getTodayString();

      if (data.date < today) {
        errors.date =
          "Reservation date cannot be in the past.";
      }
    }

    if (!data.time) {
      errors.time =
        "Please select a time.";
    }

    if (
      !Number.isInteger(data.guests) ||
      data.guests < 1 ||
      data.guests > 12
    ) {
      errors.guests =
        "Party size must be between 1 and 12.";
    }

    if (
      !/^03\d{2}-\d{7}$/.test(
        data.phone
      )
    ) {
      errors.phone =
        "Phone must match 03XX-XXXXXXX.";
    }

    if (!data.tableId) {
      errors.tableId =
        "Please select a table.";
    }

    /*
     * Booking must be at least one hour ahead.
     */
    if (
      data.date &&
      data.time &&
      getTimeDifferenceInMinutes(
        data.date,
        data.time
      ) < 60
    ) {
      errors.time =
        "Reservation must be at least one hour ahead.";
    }

    /*
     * Selected table must actually be available.
     */
    if (
      data.date &&
      data.time &&
      data.tableId &&
      data.guests >= 1 &&
      data.guests <= 12
    ) {
      const selectedTable =
        mockTables.find(
          (table) =>
            table.id === data.tableId
        );

      if (!selectedTable) {
        errors.tableId =
          "Selected table does not exist.";
      } else if (
        selectedTable.seats <
        data.guests
      ) {
        errors.tableId =
          "Selected table does not have enough seats.";
      } else if (
        isTableBooked(
          data.tableId,
          data.date,
          data.time
        )
      ) {
        errors.tableId =
          "Selected table is already booked.";
      }
    }

    return errors;
  };

  /*
   * Create a new reservation.
   */
  const createReservation = (
    data: CreateReservationPayload
  ) => {
    const errors =
      validateReservation(data);

    if (
      Object.keys(errors).length > 0
    ) {
      return {
        success: false,
        errors,
      };
    }

    const newReservation: Reservation =
      {
        id: `RES-${String(
          reservations.length + 1
        ).padStart(3, "0")}`,

        customer:
          data.customer.trim(),

        date: data.date,

        time: data.time,

        guests: data.guests,

        tableId: data.tableId,

        phone: data.phone,

        status: "Pending",
      };

    setReservations(
      (previousReservations) => [
        ...previousReservations,
        newReservation,
      ]
    );

    return {
      success: true,
      reservation: newReservation,
      errors: {},
    };
  };

  /*
   * Confirm an existing reservation.
   */
  const confirmReservation = (
    reservationId: string
  ) => {
    setReservations(
      (previousReservations) =>
        previousReservations.map(
          (reservation) =>
            reservation.id ===
            reservationId
              ? {
                  ...reservation,
                  status: "Confirmed",
                }
              : reservation
        )
    );
  };

  /*
   * Cancel an existing reservation.
   */
  const cancelReservation = (
    reservationId: string
  ) => {
    setReservations(
      (previousReservations) =>
        previousReservations.map(
          (reservation) =>
            reservation.id ===
            reservationId
              ? {
                  ...reservation,
                  status: "Cancelled",
                }
              : reservation
        )
    );
  };

  /*
   * Get reservations for one customer.
   */
  const getCustomerReservations = (
    customer: string
  ) => {
    return reservations.filter(
      (reservation) =>
        reservation.customer
          .toLowerCase()
          .trim() ===
        customer.toLowerCase().trim()
    );
  };

  return {
    reservations,
    timeSlots,
    getAvailableTables,
    isTimeSlotAvailable,
    validateReservation,
    createReservation,
    confirmReservation,
    cancelReservation,
    getCustomerReservations,
  };
}