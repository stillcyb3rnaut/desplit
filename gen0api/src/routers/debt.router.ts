import { Router, Request, Response } from "express";
import { getDebtAmount } from "../controllers/debt.controller";



export const debtRouter = Router();


debtRouter.post('/getDebt',async (req:Request,res:Response)=>{
   await getDebtAmount(req,res);
})