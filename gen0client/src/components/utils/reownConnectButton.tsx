import React from 'react';
import '@reown/appkit-wallet-button/react';
import Image from 'next/image';

export function ConnectButton() {
  return (
    <nav className="bg-slate-900 flex w-[100%]  justify-around border-b border-gray-700">
      <div className="flex">
        <Image  alt='icon' src={'https://res.cloudinary.com/dde0qo4wb/image/upload/v1738334024/desplit/b7uskqdife9vkajkhcwy.jpg'} height={40} width={165}/>
      
      <div className='flex'>
      {React.createElement('appkit-network-button')}

        {React.createElement('appkit-account-button', { balance: 'show' })}
        {/* {React.createElement('appkit-connect-button', {})} */}
        </div>
      </div>
    </nav>
  );
}
