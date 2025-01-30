import { Router, Request, Response } from "express";
import { verifyAddress } from "../controllers/auth.controller"; // Ensure correct path

const router = Router();

// Explicitly typing the request handler function
router.post("/verifyAddress", async (req: Request, res: Response) => {
  await verifyAddress(req, res);
});

export default router;
