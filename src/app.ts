import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { VehicleRoutes } from "./modules/vehicles/vehicle.routes";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", VehicleRoutes);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Vehicle Rental System API is running successfully 🚀</h1>`);
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

export default app;
