 import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

 
export async function createGroup(req: Request, res: Response) {
  const { name, description, members, callerAddress } = req.body;

  if (!name || !description || !Array.isArray(members) || !callerAddress) {
    return res.status(400).json({
      error: "Invalid input. Name, description, members, and callerAddress are required.",
    });
  }

  if (members.length === 0) {
    return res.status(401).json({ msg: "At least add one member" });
  }
 
  try {
    // Ensure all members + caller are unique
    const allMembers: string[] = Array.from(new Set([...members, callerAddress]));

    // Fetch existing users
    const existingUsers = await prisma.user.findMany({
      where: { address: { in: allMembers } },
    });

    const existingUserAddresses = new Set(existingUsers.map((user) => user.address));

    // Identify new users
    const newUsersData = allMembers
      .filter((address) => !existingUserAddresses.has(address))
      .map((address) => ({ address }));

    // Insert new users if needed
    if (newUsersData.length > 0) {
      await prisma.user.createMany({ data: newUsersData });
    }

    // **Re-fetch all users (to ensure new users include `contacts`)**
    const allUsers = await prisma.user.findMany({
      where: { address: { in: allMembers } },
    });

    // Create the group
    const group = await prisma.group.create({
      data: {
        name,
        description,
        creator: { connect: { address: callerAddress } },
        Users: { connect: allUsers.map((user) => ({ address: user.address })) },
      },
    });

    // Update each user's contacts
    await Promise.all(
      allUsers.map(async (user) => {
        const otherContacts = allUsers
          .map((u) => u.address)
          .filter((addr) => addr !== user.address);

        await prisma.user.update({
          where: { address: user.address },
          data: { contacts: { set: Array.from(new Set([...user.contacts ?? [], ...otherContacts])) } },
        });
      })
    );

    return res.status(201).json({ msg: "Group created successfully", group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}



// add members
// remove members
// leave group 



////////get funcs


//get groups


export async function getGroups(req:Request,res:Response){
  
  const {address} = req.params;
  
  if(!address){
    return res.status(400).json({msg:"Please provide the address of user"})
   }


   try{
    const user = await prisma.user.findUnique({where:{address},
    select:{groups:true}})
     
    if(!user){
      return res.status(400).json({msg:"user not find with the address"})
    }
    

    return res.status(200).json({groups: user.groups})
    
   }catch(e){  
    console.log(e);
    return res.status(500).json({msg:"INternal server error"})
    
   }

} 


 

export async function getGroupDetails(req: Request, res: Response) {
  const { id } = req.params;

  // Validate the group ID
  if (!id) {
    return res.status(400).json({ msg: 'Please provide a group ID.' });
  }

  try {
    // Fetch the group details
    const groupDetails = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        Users: true, // Include all members of the group
        creator: true, // Include the creator of the group
      },
    });

    // If the group is not found, return a 404 error
    if (!groupDetails) {
      return res.status(404).json({ msg: 'Group not found.' });
    }

    // Return the group details
    return res.status(200).json({ group: groupDetails });
  } catch (e) {
    console.error(e); // Log the error for debugging
    return res.status(500).json({ msg: 'Internal server error.' });
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client
  }
}