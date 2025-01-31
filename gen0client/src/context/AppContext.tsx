"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import axios from "axios";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const alchemyApikey = process.env.NEXT_PUBLIC_API_KEY_AC;
const SOLANA_RPC_URL = `https://solana-mainnet.g.alchemy.com/v2/${alchemyApikey}`;

type AppContextType = {
  pathname: string;
  address: string | undefined;
  isConnected: boolean;
  moneyIN: number;
  moneyOut: number;
  contacts: string[];
  groups: { id: number; name: string; description: string }[];
  refreshData: () => void;
  settleDebt: (amount: number) => Promise<void>;
  addDebt: (creditorAddress: string, debtorAddress: string, amount: number) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current pathname
  const { isConnected, address } = useAppKitAccount();

  const [moneyIN, setMoneyIN] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const [contacts, setContacts] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string; description: string }[]>([]);

  // **Fetch Solana Price**
  async function fetchSolPrice(): Promise<number> {
    try {
      const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      return res.data.solana.usd;
    } catch (error) {
      console.error("Failed to fetch SOL price:", error);
      return 0;
    }
  }

  // **Settle Debt via Solana Transaction**
  const settleDebt = useCallback(async (amount: number) => {
    if (!isConnected || !address) {
      alert("Wallet not connected");
      return;
    }

    try {
      const counterparty = pathname.split("/").pop();
      if (!counterparty) return;

      const solPrice = await fetchSolPrice();
      if (!solPrice) throw new Error("Failed to fetch SOL price");

      const solAmount = amount / solPrice;
      const lamports = BigInt(Math.round(solAmount * 1e9));

      const connection = new Connection(SOLANA_RPC_URL);
      const senderPublicKey = new PublicKey(address);
      const recipientPublicKey = new PublicKey(counterparty);

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPublicKey;

      const signedTransaction = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      await connection.confirmTransaction(signature, "finalized");
      alert(`Transaction successful! Hash: ${signature}`);

      await axios.post(`${backendUrl}/api/v0/settleDebt`, {
        creditorAddress: counterparty,
        debtorAddress: address,
      });

      alert("Debt settled in database!");
      refreshData(); // Refresh state after settlement
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed");
    }
  }, [pathname, address, isConnected]);

  // **Add Debt API**
  const addDebt = useCallback(async (creditorAddress: string, debtorAddress: string, amount: number) => {
    if (!creditorAddress || !debtorAddress || amount === 0) {
      alert("Invalid input values");
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/v0/addDebt`, {
        creditorAddress,
        debtorAddress,
        amount,
      });

      alert("Expense added successfully!");
      refreshData(); // Refresh state after adding debt
    } catch (error) {
      console.error("Error adding debt:", error);
      alert("Failed to add expense");
    }
  }, [backendUrl]);

  // **Function to Refresh Data**
  const refreshData = useCallback(async () => {
    if (!address || !backendUrl) return;

    try {
      const [contactsRes, groupsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/v0/getContacts/${address}`),
        axios.get(`${backendUrl}/api/v0/getGroups/${address}`)
      ]);

      setContacts(contactsRes.data.cuseCallbackontacts || []);
      setGroups(groupsRes.data.groups || []);

      const counterparty = pathname.split("/").pop();
      if (counterparty && pathname.includes("/contact/")) {
        const [incoming, outgoing] = await Promise.all([
          axios.post(`${backendUrl}/api/v0/getDebt`, { creditorAddress: address, debtorAddress: counterparty }),
          axios.post(`${backendUrl}/api/v0/getDebt`, { creditorAddress: counterparty, debtorAddress: address }),
        ]);

        setMoneyIN(incoming.data.amount || 0);
        setMoneyOut(outgoing.data.amount || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [address, pathname]);

  useEffect(() => {
    refreshData();
  }, [pathname, address, isConnected, refreshData]);

  return (
    <AppContext.Provider value={{ pathname, address, isConnected, moneyIN, moneyOut, contacts, groups, refreshData, settleDebt, addDebt }}>
      {children}
    </AppContext.Provider>
  );
}

// **Custom Hook for Context**
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
