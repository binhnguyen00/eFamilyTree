import { FamilyMember } from "../components/node/Node";

interface OdooPerson {
  id: number;
  name: string;
  gioi_tinh: "nam" | "nu";
}

interface OdooNode {
  id: number;
  name: string;
  gioi_tinh: "nam" | "nu";
  children: OdooNode[];
  parents: OdooPerson[];
  spouseData: OdooPerson[];
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

      // Create the primary person
      const person: FamilyMember = {
        id,
        name,
        gender,
        parents: parentIds.map((parentId) => ({ id: parentId, type: "blood" })),
        siblings: [],
        spouses: [],
        children: [],
      };

      // Add the person to the result list
      result.push(person);

      // Handle spouses (spouseData is an array)
      if (Array.isArray(node.spouseData) && node.spouseData.length > 0) {
        node.spouseData.forEach((spouseInfo) => {
          if (spouseInfo && spouseInfo.id && spouseInfo.name) {
            const spouseId = `${spouseInfo.id}`;
            const spouseName = spouseInfo.name;
            const spouseGender = spouseInfo.gioi_tinh === "nam" ? "male" : "female";

            const spouse: FamilyMember = {
              id: spouseId,
              name: spouseName,
              gender: spouseGender,
              parents: [],
              siblings: [],
              spouses: [{ id, type: "married" }],
              children: [], // Children will be added later
            };

            person.spouses.push({ id: spouseId, type: "married" });
            result.push(spouse);
          }
        });
      }

      // Process children and assign to the current person
      if (Array.isArray(node.children) && node.children.length > 0) {
        node.children.forEach((child) => {
          if (child && child.id) {
            const childId = `${child.id}`;
            person.children.push({ id: childId, type: "blood" });

            // Recursively process the child node
            processNode(child, [...parentIds, id]);
          }
        });
      }

      // After processing all children, update each spouse's children list
      if (Array.isArray(node.spouseData) && node.spouseData.length > 0) {
        node.spouseData.forEach((spouseInfo) => {
          const spouse = result.find((s) => s.id === `${spouseInfo.id}`);
          if (spouse) {
            spouse.children = [...person.children];
          }
        });
      }
    };

    // Start processing from the root node
    processNode(node);

    return result;
  }

  // Calculate node position based on provided coordinates
  public static calculateNodePosition({ left, top }: any): React.CSSProperties {
    return {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
    };
  }

  public static getMemberById(id: string, members: FamilyMember[]): FamilyMember | undefined {
    return members.find((m) => m.id === id);
  }

  public static getTreeBranch(memberId: string, members: FamilyMember[]): FamilyMember[] {
    const filteredMembers: FamilyMember[] = [];
    const visited = new Set<string>();

    const addMemberAndRelatives = (id: string, parentIds: string[] = []) => {
      // If the member has already been processed, skip it
      if (visited.has(id)) return;
      visited.add(id);

      // Find the member in the original list
      const member = members.find((m) => m.id === id);
      if (!member) return;

      // Create a copy of the member, removing its parents and siblings if it's the root
      const standaloneMember: FamilyMember = {
        ...member,
        parents: parentIds.length === 0 ? [] : parentIds.map(pid => ({ id: pid, type: "blood" })),
        siblings: [],
        spouses: [...member.spouses],
        children: [],
      };

      // Add the member to the filtered list
      filteredMembers.push(standaloneMember);

      // Collect the parent's IDs for children processing
      const currentParentIds = [id, ...standaloneMember.spouses.map(s => s.id)];

      // Recursively add children with the current member as a parent
      member.children.forEach((child) => {
        if (child && child.id) {
          addMemberAndRelatives(child.id, currentParentIds);
          standaloneMember.children.push({ id: child.id, type: "blood" });
        }
      });

      // Recursively add spouses
      standaloneMember.spouses.forEach((spouse) => addMemberAndRelatives(spouse.id));
    };

    // Start filtering from the given root memberId
    addMemberAndRelatives(memberId);

    return filteredMembers;
  }
}