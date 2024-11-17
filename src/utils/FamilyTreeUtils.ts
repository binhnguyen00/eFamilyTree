import { FamilyMember } from "../components/tree/TreeNode";

interface OdooPerson {
  id: number;
  name: string;
  avatar: string;
  gender: "male" | "female";
}

interface OdooNode {
  id: number;
  name: string;
  gender: "male" | "female";
  avatar: string;
  children: OdooNode[];
  parents: OdooPerson[];
  spouses: OdooPerson[];
}

export const NODE_WIDTH = 150;
export const NODE_HEIGHT = 200;

export class FamilyTreeUtils {
  
  public static remapServerData(node: OdooNode | null): FamilyMember[] {
    if (!node) return [];
    const result: FamilyMember[] = [];

    const processNode = (node: OdooNode, parentIds: string[] = []) => {
      const id = `${node.id}`;
      const name = node.name;
      const gender = node.gender;
      const avatar = node.avatar;

      // Create the main person
      const person: FamilyMember = {
        id,
        name,
        gender,
        avatar,
        parents: parentIds.map((parentId) => ({ id: parentId, type: "blood" })),
        siblings: [],
        spouses: [],
        children: [],
      };

      // Add the person to the result list
      result.push(person);

      // Handle spouses
      const spouseMap: { [key: string]: FamilyMember } = {};
      if (Array.isArray(node.spouses) && node.spouses.length > 0) {
        node.spouses.forEach((spouseInfo) => {
          const spouseId = `${spouseInfo.id}`;
          const spouseName = spouseInfo.name;
          const spouseGender = spouseInfo.gender;
          const spouseAvatar = spouseInfo.avatar;

          const spouse: FamilyMember = {
            id: spouseId,
            name: spouseName,
            gender: spouseGender,
            avatar: spouseAvatar,
            parents: [],
            siblings: [],
            spouses: [{ id, type: "married" }],
            children: [],
          };

          person.spouses.push({ id: spouseId, type: "married" });
          result.push(spouse);
          spouseMap[spouseId] = spouse;
        });
      }

      // Process children
      if (Array.isArray(node.children) && node.children.length > 0) {
        node.children.forEach((child) => {
          const childId = `${child.id}`;
          const childName = child.name;
          const childGender = child.gender;
          const childAvatar = child.avatar;
          const childParents = child.parents?.map(p => `${p.id}`) || [];

          const childPerson: FamilyMember = {
            id: childId,
            name: childName,
            gender: childGender,
            avatar: childAvatar,
            parents: childParents.map(parentId => ({ id: parentId, type: "blood" })),
            siblings: [],
            spouses: [],
            children: [],
          };

          // Assign the child to the main person's children list
          if (childParents.includes(id)) {
            person.children.push({ id: childId, type: "blood" });
          }

          // Assign the child to the correct spouse's children list
          childParents.forEach(parentId => {
            if (spouseMap[parentId]) {
              spouseMap[parentId].children.push({ id: childId, type: "blood" });
            }
          });

          // Recursively process the child
          processNode(child, childParents);
          result.push(childPerson);
        });
      }
    };

    // Start processing from the root node
    processNode(node);

    return result;
  }

  public static removeDuplicates(arr: any[]) {
    const map = new Map();
    return arr.filter(item => {
      if (map.has(item.id)) return false;
      map.set(item.id, true);
      return true;
    });
  }

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
      if (visited.has(id)) return;
      visited.add(id);

      const member = members.find((m) => m.id === id);
      if (!member) return;

      const standaloneMember: FamilyMember = {
        ...member,
        parents: parentIds.length === 0 ? [] : parentIds.map(pid => ({ id: pid, type: "blood" })),
        siblings: [],
        spouses: [...member.spouses],
        children: [],
      };

      filteredMembers.push(standaloneMember);

      const currentParentIds = [id, ...standaloneMember.spouses.map(s => s.id)];

      member.children.forEach((child) => {
        if (child && child.id) {
          addMemberAndRelatives(child.id, currentParentIds);
          standaloneMember.children.push({ id: child.id, type: "blood" });
        }
      });

      standaloneMember.spouses.forEach((spouse) => addMemberAndRelatives(spouse.id));
    };

    addMemberAndRelatives(memberId);

    return filteredMembers;
  }
}
