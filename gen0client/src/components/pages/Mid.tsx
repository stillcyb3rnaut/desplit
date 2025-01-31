"use client";

import { AddExpense } from "../utils/AddexpenseModal";
import { SettleButton } from "../utils/SettleButton";
import { useAppContext } from "@/context/AppContext";

export function Mid() {
  const { pathname, address, moneyIN, moneyOut } = useAppContext();
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="p-4  bg-slate-900 h-screen">
      {isDashboard ? (
        // **Dashboard View**
        <>
           <div className="flex justify-around mt-4">
            <div className="text-red-600 text-lg">You owe: ${moneyOut}</div>
            <div className="text-green-600 text-lg">You are owed: ${moneyIN}</div>
          </div>
        </>
      ) : (
        // **Contact-Specific View**
        <>
        <div className="flex justify-around">

           {address && pathname && (
            <AddExpense creditorAddress={address} debtorAddress={pathname.split("/").pop()!} />
          )}
          <SettleButton amount={moneyOut - moneyIN} />

          </div>
        </>
      )}
    </div>
  );
}
