
import { Router, Request, Response } from "express";
 import { addContact, getContacts } from "../controllers/contact.controller";

const router = Router();

// Explicitly typing the request handler function
router.get("/getContacts/:address", async (req: Request, res: Response) => {
  await getContacts(req, res);
});


 router.post("/addContact", async (req: Request, res: Response) => {
  await addContact(req, res);
});

export default router;
