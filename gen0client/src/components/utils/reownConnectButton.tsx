import React from 'react';
import '@reown/appkit-wallet-button/react';

export function ConnectButton() {
  return (
    <nav className="bg-slate-900 flex w-[100%]  justify-end border-b border-gray-700">
      <div className="flex">
      {React.createElement('appkit-network-button')}

        {React.createElement('appkit-account-button', { balance: 'show' })}
        {/* {React.createElement('appkit-connect-button', {})} */}
      
      </div>
    </nav>
  );
}
