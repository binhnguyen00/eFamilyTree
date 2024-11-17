export interface FamilyMember {
  id: string;
  name: string;
  gender: "male" | "female";
  avatar?: string;
  parents: { id: string; type: "blood" }[];
  siblings: { id: string; type: "blood" }[];
  spouses: { id: string; type: "married" }[];
  children: { id: string; type: "blood" }[];
}
