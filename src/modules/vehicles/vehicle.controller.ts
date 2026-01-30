import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.getAllVehicles();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await VehicleService.getVehicleById(id);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const result = await VehicleService.updateVehicle(vehicleId, req.body);

    if (!result) {
      return res.status(200).json({
        success: true,
        message: "Vehicle not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const result = await VehicleService.deleteVehicle(vehicleId);

    if (!result) {
      return res.status(404).json({
        success: true,
        message: "Vehicle not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
