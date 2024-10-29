interface EmployeeNode {
  id: number;
  name: string;
  parent_id: any[] | boolean;
  gioi_tinh: "nam" | "nu";
  children: EmployeeNode[];
  spouseData?: {
    id: number;
    name: string;
    gioi_tinh: "nam" | "nu";
  };
  vo_chong?: any[] | boolean;
}

export interface FamilyMember {
  id: string;
  gender: "male" | "female";
  parents: { id: string; type: "blood" }[];
  siblings: { id: string; type: "blood" }[];
  spouses: { id: string; type: "blood" }[];
  children: { id: string; type: "blood" }[];
}

export function processServerData(node: EmployeeNode): FamilyMember[] {
  const result: FamilyMember[] = [];

  const processNode = (node: EmployeeNode, parentIds: string[] = []) => {
    const id = `${node.id}-${node.name}`;
    const gender = node.gioi_tinh === "nam" ? "male" : "female";

    const person: FamilyMember = {
      id,
      gender,
      parents: parentIds.map(parentId => ({ id: parentId, type: "blood" })),
      siblings: [],
      spouses: node.spouseData ? [{ id: `${node.spouseData.id}-${node.spouseData.name}`, type: "blood" }] : [],
      children: [],
    };

    result.push(person);

    node.children.forEach((child) => {
      processNode(child, [...parentIds, id]);
    });
  };

  processNode(node);
  
  return result;
}