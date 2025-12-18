import bcrypt from "bcryptjs";
import { pool } from "../../config/db.config";

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
    [name, email, hashedPass, phone, role]
  );
  const result = createUser.rows[0];
  delete result.password;
  return result;
};

export const authService = {
  signup,
};
