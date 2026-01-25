import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.createVehicle(req.body);
    res.status(201).json({
      success: "true",
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const VehicleController = { createVehicle };
