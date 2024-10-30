interface OdooNode {
  id: number;
  name: string;
  parent_id: any[] | boolean;
  gioi_tinh: "nam" | "nu";
  children: OdooNode[];
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
  spouses: { id: string; type: "married" }[];
  children: { id: string; type: "blood" }[];
}

export function processServerData(node: OdooNode): FamilyMember[] {
  const result: FamilyMember[] = [];

  const processNode = (node: OdooNode, parentIds: string[] = []) => {
    const id = `${node.id}-${node.name}`;
    const gender = node.gioi_tinh === "nam" ? "male" : "female";

    // Initialize the primary person
    const person: FamilyMember = {
      id,
      gender,
      parents: parentIds.map(parentId => ({ id: parentId, type: "blood" })),
      siblings: [],
      spouses: [],
      children: [],
    };

    // Add the primary person to the result list
    result.push(person);

    // Initialize the spouse, but don't add them to the result list yet
    let spouse: FamilyMember | undefined;
    if (node.spouseData) {
      const spouseId = `${node.spouseData.id}-${node.spouseData.name}`;
      const spouseGender = node.spouseData.gioi_tinh === "nam" ? "male" : "female";
      
      spouse = {
        id: spouseId,
        gender: spouseGender,
        parents: [],
        siblings: [],
        spouses: [{ id, type: "married" }],  // Reference back to the main person as their spouse
        children: [], // Children will be added after processing
      };

      person.spouses.push({ id: spouseId, type: "married" });
    }

    // Process each child, adding them to the main person's children list
    node.children.forEach((child) => {
      const childId = `${child.id}-${child.name}`;
      person.children.push({ id: childId, type: "blood" });

      // Recursively process the child node, passing down both parents' IDs
      processNode(child, [...parentIds, id]);
    });

    // Now that all children are added to the main person, copy them to the spouse’s children list
    if (spouse) {
      spouse.children = [...person.children];
      result.push(spouse); // Add the spouse to the result list only now
    }
  };

  processNode(node);
  
  return result;
}

export function testProcessServerData(rootNode: OdooNode) {
  const result = processServerData(rootNode);
  console.log(result);
}