import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyAddress(req: Request, res: Response): Promise<Response> {
  try {
    const { message, signature, address } = req.body;

    if (!message || !signature || !address) {
      return res.status(400).json({ msg: "Either address, message, or signature is missing" });
    }

    console.log("Skipping verification for now.");

    let user = await prisma.user.findUnique({ where: { address } });

    if (!user) {
      user = await prisma.user.create({ data: { address } });
    }

    return res.status(200).json({ message: "Address accepted (verification skipped)", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
