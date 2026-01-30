import { pool } from "../../config/db.config";

const getAllUsers = async () => {
  const users = await pool.query(
    `SELECT id, name, email, phone, role FROM users`,
  );
  return users;
};

const updateUser = async (
  id: number,
  payload: Record<string, unknown>,
  isAdmin: boolean,
) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users SET 
      name=COALESCE($1, name), 
      email=COALESCE($2, email), 
      phone=COALESCE($3, phone), 
      role=COALESCE($4, role) 
      WHERE id=$5 
      RETURNING id, name, email, phone, role
    `,
    [name, email, phone, isAdmin ? role : null, id],
  );
  return result;
};

const deleteUser = async (id: number) => {
  const activeBooking = await pool.query(
    `SELECT 1 FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id],
  );

  if (activeBooking.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  return result;
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
