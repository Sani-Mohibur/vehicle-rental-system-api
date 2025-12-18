import app from "./app";
import initDb from "./config/db.config";

initDb();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
