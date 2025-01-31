"use client";

import { useAppContext } from "@/context/AppContext";

export function SettleButton({ amount }: { amount: number }) {
  const { settleDebt } = useAppContext();
  const isDisabled = amount <= 0;

  return (
    <button
      className={`px-4 py-2 rounded-3xl text-white transition ${
        isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
      }`}
      disabled={isDisabled}
      onClick={() => settleDebt(amount)}
    >
      {isDisabled ? "You are already settled" : `Settle ($${amount})`}
    </button>
  );
}

