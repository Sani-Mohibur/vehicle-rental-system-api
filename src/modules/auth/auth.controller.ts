import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      success: "true",
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    // if (error.message === "User already exists") {
    //   return res.status(400).json({ message: error.message });
    // }
    return res.status(500).json({ message: "Server error", error });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const result = await authService.signin(req.body);
    res.status(200).json({
      success: "true",
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const authController = { signup, signin };
