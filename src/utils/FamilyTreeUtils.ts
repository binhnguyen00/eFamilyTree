import { TreeConfig } from "components";
import { Node, Gender, RelType } from "components/tree-relatives/types";

interface OdooPerson {
  id: number;
  name: string;
  avatar: string;
  gender: Gender;
}

interface OdooNode {
  id: number;
  name: string;
  gender: Gender;
  avatar: string;
  children: OdooNode[];
  parents: OdooPerson[];
  spouses: OdooPerson[];
}

export class FamilyTreeUtils {
  
  /** @deprecated */
  public static remapServerData(node: OdooNode | null): Node[] {
    if (!node) return [];
    const result: Node[] = [];

    const processNode = (node: OdooNode, parentIds: string[] = []): void => {
      const id = `${node.id}`;
      const { name, gender, avatar } = node;

      // Create the main Node object
      const person: Node = {
        id,
        name,
        gender,
        avatar,
        parents: parentIds.map(parentId => ({ id: parentId, type: RelType.blood })),
        siblings: [],
        spouses: [],
        children: []
      };

      result.push(person);

      // Handle spouses
      const spouseMap: { [key: string]: Node } = {};
      if (Array.isArray(node.spouses) && node.spouses.length > 0) {
        node.spouses.forEach(spouseInfo => {
          const spouseId = `${spouseInfo.id}`;
          const spouse: Node = {
            id: spouseId,
            name: spouseInfo.name,
            gender: spouseInfo.gender,
            avatar: spouseInfo.avatar,
            parents: [],
            siblings: [],
            spouses: [{ id, type: RelType.married }],
            children: []
          };

          person.spouses = [...person.spouses, { id: spouseId, type: RelType.married }];
          result.push(spouse);
          spouseMap[spouseId] = spouse;
        });
      }

      // Process children
      if (Array.isArray(node.children) && node.children.length > 0) {
        node.children.forEach(child => {
          const childId = `${child.id}`;
          const childParents = child.parents?.map(p => `${p.id}`) || [];

          const childNode: Node = {
            id: childId,
            name: child.name,
            gender: child.gender,
            avatar: child.avatar,
            parents: childParents.map(parentId => ({ id: parentId, type: RelType.blood })),
            siblings: [],
            spouses: [],
            children: []
          };

          // Assign the child to the main person's children list
          if (childParents.includes(id)) {
            person.children = [...person.children, { id: childId, type: RelType.blood }];
          }

          // Assign the child to the correct spouse's children list
          childParents.forEach(parentId => {
            if (spouseMap[parentId]) {
              spouseMap[parentId].children = [...spouseMap[parentId].children, { id: childId, type: RelType.blood }];
            }
          });

          // Recursively process the child
          processNode(child, childParents);
          result.push(childNode);
        });
      }
    };

    // Start processing from the root node
    processNode(node);

    return result;
  }

  // Remove duplicates from the list
  /** @deprecated */
  public static removeDuplicates(arr: Node[]): Node[] {
    const map = new Map<string, boolean>();
    return arr.filter(item => {
      if (map.has(item.id)) return false;
      map.set(item.id, true);
      return true;
    });
  }

  // Calculate the node position for rendering
  public static calculateNodePosition({ left, top }: { left: number; top: number }): React.CSSProperties {
    return {
      width: TreeConfig.nodeWidth,
      height: TreeConfig.nodeHeight,
      transform: `translate(${left * (TreeConfig.nodeWidth / 2)}px, ${top * (TreeConfig.nodeHeight / 2)}px)`
    };
  }

  // Get a member by ID
  public static getMemberById(id: string, members: Node[]): Node | undefined {
    return members.find(member => member.id === id);
  }

  // Get tree branch for a specific member
  public static getTreeBranch(memberId: string, members: Node[]): Node[] {
    const filteredMembers: Node[] = [];
    const visited = new Set<string>();

    const addMemberAndRelatives = (id: string, parentIds: string[] = []): void => {
      if (visited.has(id)) return;
      visited.add(id);

      const member = members.find(m => m.id === id);
      if (!member) return;

      const standaloneMember: Node = {
        ...member,
        parents: parentIds.length === 0 ? [] : parentIds.map(pid => ({ id: pid, type: RelType.blood })),
        siblings: [],
        spouses: [...member.spouses],
        children: []
      };

      filteredMembers.push(standaloneMember);

      const currentParentIds = [id, ...standaloneMember.spouses.map(s => s.id)];

      member.children.forEach(child => {
        if (child && child.id) {
          addMemberAndRelatives(child.id, currentParentIds);
          standaloneMember.children = [...standaloneMember.children, { id: child.id, type: RelType.blood }];
        }
      });

      standaloneMember.spouses.forEach(spouse => addMemberAndRelatives(spouse.id));
    };

    addMemberAndRelatives(memberId);

    return filteredMembers;
  }
}
