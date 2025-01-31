'use client'

import React from 'react'
import { ConnectButton } from '../utils/reownConnectButton';
import { Left } from './Left';
import { Right } from './Right';



import { Mid } from './Mid';
import { useAppKitAccount } from '@reown/appkit/react';

export default function MainApp() {

 const {address} = useAppKitAccount()
  
  
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
