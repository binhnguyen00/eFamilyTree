import { FamilyMember } from "../../components/node/Node";

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

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 80;

export class FamilyTreeUtils {
  
  public static remapServerData(node: OdooNode): FamilyMember[] {
    const result: FamilyMember[] = [];

    const processNode = (node: OdooNode, parentIds: string[] = []) => {
      const id = `${node.id}`;
      const name = node.name;
      const gender = node.gioi_tinh === "nam" ? "male" : "female";

      const person: FamilyMember = {
        id,
        name,
        gender,
        parents: parentIds.map(parentId => ({ id: parentId, type: "blood" })),
        siblings: [],
        spouses: [],
        children: [],
      };

      // Add the primary person to the result list
      result.push(person);

      let spouse: FamilyMember | undefined;
      if (node.spouseData) {
        const spouseId = `${node.spouseData.id}`;
        const spouseName = node.spouseData.name;
        const spouseGender = node.spouseData.gioi_tinh === "nam" ? "male" : "female";
        
        spouse = {
          id: spouseId,
          name: spouseName,
          gender: spouseGender,
          parents: [],
          siblings: [],
          spouses: [{ id, type: "married" }],
          children: [], // Children will be added after processing
        };

        person.spouses.push({ id: spouseId, type: "married" });
      }

      // Process each child, adding them to the main person's children list
      node.children.forEach((child) => {
        const childId = `${child.id}`;
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

  public static calculateNodePosition({ left, top }: any): React.CSSProperties {
    return {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
    };
  }
}