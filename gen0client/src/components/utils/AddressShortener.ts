
export function shortAddr(address:string | undefined ) {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  