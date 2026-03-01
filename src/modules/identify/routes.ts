import { Router } from "express";
import { identifyController } from "./controller.js";

const router = Router();

router.post("/", identifyController);

export default router;