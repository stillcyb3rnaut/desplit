'use client'

import { Left } from "@/components/pages/Left";
import { Mid } from "@/components/pages/Mid";
import { Right } from "@/components/pages/Right";
import { ConnectButton } from "@/components/utils/reownConnectButton";

import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect } from "react";
 import bs58 from "bs58";
import axios from "axios";

export default function Home() {
  const { isConnected, address } = useAppKitAccount();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
 
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
  }, [address, isConnected]);



  const isEthereumAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  return (
    <div>
      <ConnectButton />

      <div className="w-screen h-screen flex justify-between">
        {/* Left section */}
        <div className="w-[30%] border-r border-gray-700">
          <Left />
        </div>

        {/* Middle section */}
        <div className="w-[40%]">
          {address && (
            <div>
              {isEthereumAddress(address) ? "We're coming to Ethereum soon..." : <Mid />}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="w-[30%] border-l border-gray-700">
          <Right />
        </div>
      </div>
    </div>
  );
}

