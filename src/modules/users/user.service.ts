import { pool } from "../../config/db.config";

const getAllUsers = async () => {
  const users = await pool.query(`SELECT * FROM users`);
  return users;
};

const updateUser = async (id: string, payload: Record<string, unknown>) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
    [name, email, phone, role, id],
  );
  return result;
};

export const userService = {
  getAllUsers,
  updateUser,
};
