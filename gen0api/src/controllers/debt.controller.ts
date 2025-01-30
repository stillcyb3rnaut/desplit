import { prisma } from "../utils/prismaClient";
import { Request, Response } from "express";

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
