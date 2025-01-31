import { Router, Request, Response } from "express";
import { addDebt, getDebtAmount, settleDebt } from "../controllers/debt.controller";



export const debtRouter = Router();


debtRouter.post('/getDebt',async (req:Request,res:Response)=>{
   await getDebtAmount(req,res);
})


debtRouter.post('/addDebt',async (req:Request,res:Response)=>{
   await addDebt(req,res);
})

debtRouter.post('/settleDebt',async (req:Request,res:Response)=>{
   await settleDebt(req,res);
})
