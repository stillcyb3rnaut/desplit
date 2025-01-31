import { prisma } from "../utils/prismaClient";
import { Request, Response } from "express";



////post 


export async function addDebt(req: Request, res: Response) {
    const { creditorAddress, debtorAddress, amount } = req.body;

    try {
        // Ensure amount is valid
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Fetch users by their addresses
        const creditor = await prisma.user.findUnique({
            where: { address: creditorAddress },
        });

        const debtor = await prisma.user.findUnique({
            where: { address: debtorAddress },
        });

        // Check if both users exist
        if (!creditor) {
            return res.status(404).json({ error: "Creditor not found" });
        }

        if (!debtor) {
            return res.status(404).json({ error: "Debtor not found" });
        }

        // Check if a debt record already exists
        const existingDebt = await prisma.debt.findFirst({
            where: {
                debtorId: debtor.id,
                creditorId: creditor.id,
            },
        });

        if (existingDebt) {
            // Update the existing debt amount
            await prisma.debt.update({
                where: { id: existingDebt.id },
                data: { amount: existingDebt.amount + amount },
            });
        } else {
            // Create a new debt record
            await prisma.debt.create({
                data: {
                    debtorId: debtor.id,
                    creditorId: creditor.id,
                    amount,
                },
            });
        }

        return res.json({ message: "Debt added successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

 
export async function settleDebt(req: Request, res: Response) {
  const { creditorAddress, debtorAddress } = req.body;

  try {
    // Find the creditor and debtor by address
    const creditor = await prisma.user.findUnique({
      where: { address: creditorAddress },
    });

    const debtor = await prisma.user.findUnique({
      where: { address: debtorAddress },
    });

    // Check if both users exist
    if (!creditor) {
      return res.status(404).json({ error: "Creditor not found" });
    }
    if (!debtor) {
      return res.status(404).json({ error: "Debtor not found" });
    }

    // Find existing debt
    const existingDebt = await prisma.debt.findFirst({
      where: { creditorId: creditor.id, debtorId: debtor.id },
    });

    const reverseDebt = await prisma.debt.findFirst({
      where: { creditorId: debtor.id, debtorId: creditor.id },
    });

    if (!existingDebt && !reverseDebt) {
      return res.status(400).json({ error: "No debt found between these users" });
    }

    // Settle both debts (if they exist)
    if (existingDebt) {
      await prisma.debt.update({
        where: { id: existingDebt.id },
        data: { amount: 0 },
      });
    }

    if (reverseDebt) {
      await prisma.debt.update({
        where: { id: reverseDebt.id },
        data: { amount: 0 },
      });
    }

    return res.json({ message: "Debt settled successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}



///get 

export async function getDebtAmount(req: Request, res: Response) {
    const { creditorAddress, debtorAddress } = req.body;

    try {
        // Fetch the users based on their addresses
        const creditor = await prisma.user.findUnique({
            where: { address: creditorAddress },
        });

        const debtor = await prisma.user.findUnique({
            where: { address: debtorAddress },
        });

        // Check if both users exist
        if (!creditor) {
            return res.status(404).json({ error: "Creditor not found" });
        }

        if (!debtor) {
            return res.status(404).json({ error: "Debtor not found" });
        }

        // Fetch the debt record between the creditor and the debtor
        const debt = await prisma.debt.findFirst({
            where: {
                debtorId: debtor.id,
                creditorId: creditor.id,
            },
        });

        // If no debt exists, return 0
        const amount = debt ? debt.amount : 0;
        return res.json({ amount });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
