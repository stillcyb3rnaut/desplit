'use client';

import { useState } from 'react';

export function SearchBar({ onSearch }: { onSearch: (address: string) => void }) {
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress) {
      onSearch(walletAddress);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Enter wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
