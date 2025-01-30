
import { Router, Request, Response } from "express";
 import { getContacts } from "../controllers/contact.controller";

const router = Router();

// Explicitly typing the request handler function
router.get("/getContacts/:address", async (req: Request, res: Response) => {
  await getContacts(req, res);
});

export default router;
