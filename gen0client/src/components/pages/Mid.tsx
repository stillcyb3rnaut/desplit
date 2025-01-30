import React, { useEffect, useState } from 'react'
 

export  function Mid() {
  const [hash, setHash] = useState("");


  useEffect(() => {
    setHash(window.location.hash); // Get current hash

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };   
     window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

   
  if(hash==='#/dashboard'){
    return <div className=' '>
      Dashboard

      <br></br>

      <div className='flex justify-around'>
        <div className='text-red-600'>You owe:1000</div>
        <div className='text-green-600'>You are owed:10002</div>
      </div>
    </div>
  }
}
