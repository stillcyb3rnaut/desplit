"use client";

import { useAppContext } from "@/context/AppContext";
import { shortAddr } from "../utils/AddressShortener";
 
export function Right() {
  const { pathname, moneyIN, moneyOut } = useAppContext();
  const counterparty = pathname.split("/").pop();
  const isSettled = moneyIN === moneyOut;
  
  if(!pathname.includes('contact')){
    return <div className="bg-slate-900 h-screen"></div>
  }
  return (
    <div className="w-full p-4 text-white bg-slate-900 h-screen">

      {counterparty ? (
        isSettled ? (
          <div>You and {shortAddr(counterparty)} are settled</div>
        ) : moneyIN > moneyOut ? (
          <div className="text-green-500">
            {shortAddr(counterparty)} owes you ${moneyIN - moneyOut}
          </div>
        ) : (
          <div className="text-red-500">
            You owe {shortAddr(counterparty)} ${moneyOut - moneyIN}
          </div>
        )
      ) : (
        <div>No counterparty selected</div>
      )}
    </div>
  );
}
