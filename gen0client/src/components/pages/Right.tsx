'use client'

import { useAppKitAccount } from "@reown/appkit/react";
import axios from "axios";
import { useEffect, useState } from "react";

export function Right() {
    const [hash, setHash] = useState("");
    const [moneyIN, setMoneyIN] = useState(0);
    const [moneyOut, setMoneyOut] = useState(0);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { address } = useAppKitAccount();

    useEffect(() => {
        async function apiCall() {
            if (!hash || !address) return; // Ensure values exist before API call
            const counterparty = hash.split('/').pop();
            if (!counterparty) return;

            try {
                const [incoming, outgoing] = await Promise.all([
                    axios.post(`${backendUrl}/api/v0/getDebt`, {
                        creditorAddress: address,
                        debtorAddress: counterparty,
                    }),
                    axios.post(`${backendUrl}/api/v0/getDebt`, {
                        creditorAddress: counterparty,
                        debtorAddress: address,
                    })
                ]);

                setMoneyIN(incoming.data.amount || 0);
                setMoneyOut(outgoing.data.amount || 0);
                console.log(incoming);
                
            } catch (error) {
                console.error("Error fetching debt data:", error);
            }
        }

        apiCall();
    }, [backendUrl,hash, address]);

    useEffect(() => {
        setHash(window.location.hash); // Get current hash

        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, [hash]);

    return (
        <div className="w-[100%] bg-cyan-700 p-4 text-white">
            <p> You have to give: <strong>{moneyOut}</strong></p>
            <p>You will receive: <strong>{moneyIN}</strong></p>
        </div>
    );
}
