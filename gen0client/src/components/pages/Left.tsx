"use client";

import { useAppContext } from "@/context/AppContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { shortAddr } from "../utils/AddressShortener";

export function Left() {
  const { contacts, groups, refreshData } = useAppContext();

  return (
    <div className="p-4 text-white h-screen w-full flex flex-col gap-6 bg-slate-900 ">
      {/* Dashboard */}
      <Link href="/dashboard">
        <h2 className="cursor-pointer text-xl font-semibold hover:text-gray-300 hover:underline transition">
          Dashboard
        </h2>
      </Link>

      {/* Groups Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Groups</h3>
          <button onClick={refreshData} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition">
            <Plus size={18} />
          </button>
        </div>
        <ul className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group.id} className="cursor-pointer bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition">
                <Link href={`/group/${group.id}`} className="block">
                  <strong>{group.name}</strong>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No groups joined yet</li>
          )}
        </ul>
      </div>

      {/* Contacts Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contacts</h3>
          <button onClick={refreshData} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition">
            <Plus size={18} />
          </button>
        </div>
        <ul className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <li key={index} className="cursor-pointer bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition">
                <Link href={`/contact/${contact}`} className="block">
                  {shortAddr(contact)}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No contacts found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
