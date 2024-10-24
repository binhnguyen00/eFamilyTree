import React from "react";
import familyMembers from './members.json'; // Import JSON

interface IFamilyMember {
  id: number
  name: string
  birthYear: number
  description: string
  children?: IFamilyMember[]
}

export function UIFamilyTree() {
  const members: IFamilyMember = familyMembers;
  console.log(members);

  return (
    <div>
      TODO
    </div>
  )
}
