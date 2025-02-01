import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient"; // Import Prisma client




export async function addContact(req: Request, res: Response) {
  const { owner, contact } = req.body;

  try {
    // Validate input
    if (!owner || !contact) {
      return res.status(400).json({ msg: "Owner and contact are required" });
    }

    // Find or create the owner
    let ownerUser = await prisma.user.upsert({
      where: { address: owner },
      update: {},
      create: { address: owner, contacts: [] },
    });

    // Find or create the contact
    let contactUser = await prisma.user.upsert({
      where: { address: contact },
      update: {},
      create: { address: contact, contacts: [] },
    });

    // Update owner's contacts if not already added
    if (!ownerUser.contacts.includes(contact)) {
      ownerUser = await prisma.user.update({
        where: { address: owner },
        data: { contacts: { push: contact } }, // Append new contact
      });
    }

    // Update contact's contacts if not already added
    if (!contactUser.contacts.includes(owner)) {
      contactUser = await prisma.user.update({
        where: { address: contact },
        data: { contacts: { push: owner } }, // Append new contact
      });
    }

    return res.status(200).json({
      msg: "Contacts updated successfully",
      ownerContacts: ownerUser.contacts,
      contactContacts: contactUser.contacts,
    });

  } catch (error) {
    console.error("Error adding contact:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}


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