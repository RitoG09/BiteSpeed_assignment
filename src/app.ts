import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import identifyRoutes from "./modules/identify/routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use("/identify",identifyRoutes)

app.use(errorMiddleware);

export default app;