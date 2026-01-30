import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { formatDate } from "../../utils/date.utils";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;
    const user = req.user;

    if (user.role !== "admin" && user.id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const result = await BookingService.createBooking(req.body);

    const formattedResult = {
      ...result,
      rent_start_date: formatDate(result.rent_start_date),
      rent_end_date: formatDate(result.rent_end_date),
    };

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: formattedResult,
    });
  } catch (error: any) {
    res.status(500).json({ message: " Server error", error: error.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await BookingService.getAllBookings(user);

    const formattedResult = result.map((b: any) => ({
      ...b,
      rent_start_date: formatDate(b.rent_start_date),
      rent_end_date: formatDate(b.rent_end_date),
    }));

    res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: formattedResult,
    });
  } catch (error: any) {
    res.status(500).json({ message: " Server error", error: error.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const user = req.user;
    const { status } = req.body;

    const updatedBooking = await BookingService.updateBooking(
      bookingId,
      { status },
      user,
    );

    const formattedBooking = {
      ...updatedBooking,
      rent_start_date: formatDate(updatedBooking.rent_start_date),
      rent_end_date: formatDate(updatedBooking.rent_end_date),
    };

    let message = "";
    if (user.role === "customer") {
      message = "Booking cancelled successfully";
    } else if (user.role === "admin") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    res.status(200).json({
      success: true,
      message,
      data: formattedBooking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const BookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
