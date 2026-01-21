import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import { jwtToken } from "../utils/token.utils";
import config from "../config/index.config";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}

const auth = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new Error("You are not authorized");

      const varifiedToken = jwtToken.verifyToken(
        token,
        config.jwt_secret as Secret,
      ) as JwtPayload;

      // Defensive check for role
      if (
        role.length &&
        (!varifiedToken ||
          !varifiedToken.role ||
          !role.includes(varifiedToken.role))
      ) {
        throw new Error("You are not authorized to access this resource");
      }
      req.user = varifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
