import express from "express";
import { VehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/", VehicleController.createVehicle);

export const VehicleRoutes = router;
