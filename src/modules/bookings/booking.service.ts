import { pool } from "../../config/db.config";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status
        FROM vehicles WHERE id = $1`,
    [vehicle_id],
  );
  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);
  const diffTime = end.getTime() - start.getTime();
  const number_of_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (number_of_days <= 0) {
    throw new Error("Invalid rental dates");
  }

  const total_price = vehicle.daily_rent_price * number_of_days;

  const bookingResult = await pool.query(
    `INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price],
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id],
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
            SELECT b.*,
            json_build_object('name', u.name, 'email', u.email) AS customer,
            json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.rent_start_date DESC
            `);
    return result.rows;
  } else {
    const result = await pool.query(
      `
        SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
            json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1
            ORDER BY b.rent_start_date DESC
        `,
      [user.id],
    );
    return result.rows;
  }
};

const updateBooking = async (
  bookingId: number,
  payload: Record<string, unknown>,
  user: any,
) => {
  const { status } = payload;

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId],
  );
  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }
  const booking = bookingResult.rows[0];

  const vehicleResult = await pool.query(
    `SELECT id, availability_status FROM vehicles WHERE id = $1`,
    [booking.vehicle_id],
  );
  const vehicle = vehicleResult.rows[0];
  const today = new Date();
  const rentStart = new Date(booking.rent_start_date);

  if (user.role === "customer") {
    if (user.id !== booking.customer_id) {
      throw new Error("You can only update your own bookings");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
    if (today >= rentStart) {
      throw new Error("Cannot cancel booking after start date");
    }
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId],
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id],
    );

    return result.rows[0];
  }

  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark bookings as returned");
    }

    const result = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId],
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id],
    );

    return {
      ...result.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  throw new Error("Invalid operation");
};

export const BookingService = { createBooking, getAllBookings, updateBooking };
