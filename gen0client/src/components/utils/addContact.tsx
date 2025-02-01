"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus } from "lucide-react";

export function AddContact() {
  const { addContact, address: owner } = useAppContext(); // Get logged-in user's address
  const [contact, setContact] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleAddContact() {
    if (!contact.trim()) {
      alert("Please enter a valid contact address.");
      return;
    }

    if (!owner) {
      alert("User is not connected.");
      return;
    }

    addContact(owner, contact);
    setIsOpen(false); // Close modal after adding contact
    setContact(""); // Clear input
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className=" text-white px-4 py-2 rounded-3xl" onClick={() => setIsOpen(true)}>
          <Plus/>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>Enter the wallet address of the contact you want to add.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="text"
            placeholder="Enter contact address"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="p-2 rounded-3xl bg-slate-900 w-full text-white"
          />
        </div>
        <DialogFooter>
          <button onClick={handleAddContact} className="bg-green-500 text-white px-4 py-2 rounded-3xl">
            Add Contact
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
