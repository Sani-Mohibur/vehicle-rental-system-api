import { Request, Response } from "express";
import { pool } from "../../config/db.config";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.json({
      status: "success",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(req.params.id!, req.body);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "Data updated successfully", data: result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
};
