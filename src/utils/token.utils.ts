import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const genaretToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: string | any,
): string => {
  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, secret, options);

  return token;
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  const decoded = jwt.verify(token, secret);
  if (!decoded) throw new Error("You are not authorized");
  return decoded as JwtPayload;
};

export const jwtToken = {
  genaretToken,
  verifyToken,
};
