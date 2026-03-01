import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";

const PORT = Number(env.PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
