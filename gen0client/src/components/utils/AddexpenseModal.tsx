import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { shortAddr } from "./AddressShortener";
import { useAppContext } from "@/context/AppContext";

export function AddExpense({ creditorAddress, debtorAddress }: { creditorAddress: string; debtorAddress: string }) {
  const { addDebt } = useAppContext();
  const [amount, setAmount] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleAddDebt() {
    if (!amount) return;
    addDebt(creditorAddress, debtorAddress, amount);
    setIsOpen(false); // Close modal after adding expense
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-red-500 text-white px-4 py-2 rounded-3xl" onClick={() => setIsOpen(true)}>
          Add Expense
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense to {shortAddr(debtorAddress)}</DialogTitle>
          <DialogDescription>Enter the expense amount and save.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="p-2 rounded-3xl bg-slate-900 w-full"
          />
        </div>
        <DialogFooter>
          <button onClick={handleAddDebt} className="bg-green-500 text-white px-4 py-2 rounded-3xl">
            Save Expense
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
