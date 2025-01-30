import { Router, Request, Response } from "express";
import { createGroup, getGroupDetails, getGroups } from "../controllers/group.controller";

const router = Router();

// Explicitly typing the request handler function
router.post("/createGroup", async (req: Request, res: Response) => {
  await createGroup(req, res);
});

router.get("/getGroups/:address", async (req: Request, res: Response) => {
  await getGroups(req, res);
});

router.get("/getGroup/:id",async(req:Request,res:Response)=>{
  await getGroupDetails(req,res);
})


export default router;
