import bcrypt from "bcryptjs";
import { pool } from "../../config/db.config";
import { jwtToken } from "../../utils/token.utils";
import config from "../../config/index.config";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const userExists = await pool.query(`SELECT 1 FROM users WHERE email=$1`, [
    email,
  ]);
  if (userExists.rows.length > 0) {
    throw new Error("User already exists");
  }
  const hashedPass = await bcrypt.hash(password as string, 10);
  const createUser = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role],
  );
  const result = createUser.rows[0];
  delete result.password;
  return result;
};

const signin = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const userExists = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  const user = userExists.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password as string, user.password);
  if (!isMatch) {
    throw new Error("Wrong password!");
  }

  const accessToken = jwtToken.genaretToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt_secret as string,
    "30d",
  );

  const result = user;
  delete result.password;
  return {
    token: accessToken,
    user: result,
  };
};

export const authService = {
  signup,
  signin,
};
