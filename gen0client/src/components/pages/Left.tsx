'use client'

import { useAppKitAccount } from '@reown/appkit/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function Left() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isConnected, address } = useAppKitAccount();

  const [contacts, setContacts] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string; description: string }[]>([]);

  useEffect(() => {
    if (!address || !backendUrl) return;

    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactsRes = await axios.get(`${backendUrl}/api/v0/getContacts/${address}`);
        setContacts(contactsRes.data.contacts || []);

        // Fetch groups
        const groupsRes = await axios.get(`${backendUrl}/api/v0/getGroups/${address}`);
        setGroups(groupsRes.data.groups || []); // Store entire objects, not just names
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [address, isConnected, backendUrl]);

  return (
    <div>
      <h2 onClick={() => router.push('/#/dashboard')} className="cursor-pointer ">Dashboard</h2>

      <div>
        <h3>Groups</h3>
        <button className="bg-slate-600 rounded-xl ml-2">Create or Join Groups</button>
        <ul>
          {groups.length > 0 ? (
            groups.map((group) => (
              <li className='cursor-pointer' onClick={()=>router.push(`#/group/${group.id}`)} key={group.id}>
                <strong>{group.name}</strong>
              </li>
            ))
          ) : (
            <li>No groups joined yet</li>
          )}
        </ul>
      </div>

      <div>
        <h3>Contacts</h3>
        <button className="bg-slate-600 rounded-xl ml-2">Add New Contact Addresses</button>
        <ul>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => <li className='cursor-pointer' onClick={()=>router.push(`#/contact/${contact}`)} key={index}>{contact}</li>)
          ) : (
            <li>No contacts found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
