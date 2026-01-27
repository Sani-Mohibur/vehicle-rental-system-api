import { Request, Response } from "express";
import { pool } from "../../config/db.config";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const user = req.user;
    console.log(user);
    if (user.role !== "admin" && user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this user",
      });
    }

    const result = await userService.updateUser(
      userId,
      req.body,
      user.role === "admin",
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      res.json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const result = await userService.deleteUser(userId);

    if (!result) {
      return res.status(404).json({
        success: true,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
