import React from 'react';
import '@reown/appkit-wallet-button/react';

export function ConnectButton() {
  return (
    <nav className="navbar">
      <div className="nav-buttons">
        {React.createElement('appkit-account-button', { balance: 'show' })}
        {React.createElement('appkit-network-button')}
        {/* {React.createElement('appkit-connect-button', {})} */}

      </div>
    </nav>
  );
}
