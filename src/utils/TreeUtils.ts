import { TreeConfig } from "components";
import { RelType, Node, ExtNode } from "components/tree-relatives/types";

export class TreeUtils {

  public static getSubNodes(nodeId: string, nodes: Node[]): Node[] {
    let filteredMembers: Node[] = [];
    const visited = new Set<string>();

    const addMemberAndRelatives = (id: string, parentIds: string[] = []): void => {
      if (visited.has(id)) return;
      visited.add(id);

      const member = nodes.find(m => m.id === id);
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

    addMemberAndRelatives(nodeId);
    return filteredMembers;
  }

  public static calculateNodePosition(node: ExtNode): React.CSSProperties {
    const { left, top } = node;
    const width = TreeConfig.nodeWidth / 2;
    const height = TreeConfig.nodeHeight / 2;
    return {
      transform: `translate(${left * width}px, ${top * height}px)`
    };
  }

  public static getMemberById(id: string, members: Node[]): Node | undefined {
    return members.find(member => member.id === id);
  }
}