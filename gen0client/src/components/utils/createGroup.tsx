"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { Plus } from "lucide-react";

export function CreateGroup() {
  const { createGroup, address } = useAppContext();
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([""]); // Start with one input field
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Add a new empty input field for a member address
  const addMemberField = () => {
    setMembers([...members, ""]);
  };

  // Update member address at a specific index
  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  // Handle group creation
  function handleCreateGroup() {
    if (!groupName || !description || members.some((m) => !m.trim())) {
      alert("Please fill in all fields");
      return;
    }

    createGroup(groupName, description, members, address!);
    setIsOpen(false); // Close modal after creating group
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="  text-white px-4 py-2 rounded-3xl" onClick={() => setIsOpen(true)}>
        <Plus  />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>Enter group details and add members.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="p-2 rounded-3xl bg-slate-900 w-full text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded-3xl bg-slate-900 w-full text-white"
          />
          <div className="flex flex-col gap-2">
            {members.map((member, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Member Address ${index + 1}`}
                value={member}
                onChange={(e) => updateMember(index, e.target.value)}
                className="p-2 rounded-3xl bg-slate-900 w-full text-white"
              />
            ))}
            <button
              onClick={addMemberField}
              className="bg-gray-700 text-white px-4 py-2 rounded-3xl mt-2"
            >
              + Add Member
            </button>
          </div>
        </div>
        <DialogFooter>
          <button onClick={handleCreateGroup} className="bg-green-500 text-white px-4 py-2 rounded-3xl">
            Create Group
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
