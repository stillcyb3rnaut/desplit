import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";


// get contacts

 
export async function getContacts (req:Request,res:Response){

   const {address} = req.params;

   if(!address){
    return res.status(400).json({msg:"Please provide the address of user"})
   }

   try{
     
    const user = await prisma.user.findUnique({
        where:{address},
        select: {contacts:true}
    })

    if(!user){
        return res.json(400).json({msg:"No user found"})
    }

    return res.status(200).json({contacts:user.contacts})



   }catch(e){
    console.log(e);

    return res.status(500).json({msg:"Server error"});
    
   }

}