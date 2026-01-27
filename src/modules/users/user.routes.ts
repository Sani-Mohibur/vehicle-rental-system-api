import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth.middleware";
import { userRole } from "./user.constant";

const router = express.Router();

router.get("/", auth(userRole.admin), userController.getAllUsers);
router.put("/:userId", userController.updateUser);

export const userRoutes = router;
