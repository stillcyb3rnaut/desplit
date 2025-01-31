'use client'
 

import MainApp from "@/components/pages/MainApp";
import { useEffect } from "react";

import { useAppKitAccount } from '@reown/appkit/react';
  import bs58 from "bs58";
import axios from "axios";
   
export default function Home() {


  const { isConnected, address } = useAppKitAccount();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const isEthereumAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  
  useEffect(() => {
    const verifyAddress = async () => {
      if (!address ) return;

      try {
        const message = `Sign this message to verify your address: ${address}`;
        let signedMessage = "";

        if (isEthereumAddress(address)) {
           console.log('eth soon');
           
        } else {
          // Solana message signing
          const encodedMessage = new TextEncoder().encode(message);
          const signedBytes = await window.solana.signMessage(encodedMessage, "utf8");
          signedMessage = bs58.encode(signedBytes.signature);
        }

 
        // Send verification request
        await axios.post(`${backendUrl}/api/v0/verifyAddress`, {
          address,
          message,
          signature: signedMessage
        });

      } catch (error) {
        console.error("Error signing message:", error);
      }
    };

    verifyAddress();
  }, [isConnected,address ,backendUrl]);

  return (
    <>
      <MainApp/>
    </>
)
}

