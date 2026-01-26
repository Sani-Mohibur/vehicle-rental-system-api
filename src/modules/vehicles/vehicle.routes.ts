import express from "express";
import { VehicleController } from "./vehicle.controller";
import { userRole } from "../users/user.constant";
import auth from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", auth(userRole.admin), VehicleController.createVehicle);
router.get("/", VehicleController.getAllVehicles);
router.get("/:id", VehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  auth(userRole.admin),
  VehicleController.updateVehicle,
);
router.delete(
  "/:vehicleId",
  auth(userRole.admin),
  VehicleController.updateVehicle,
);

export const VehicleRoutes = router;
