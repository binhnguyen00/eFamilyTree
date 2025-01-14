import { TreeConfig } from "components";
import { RelType, Node } from "components/tree-relatives/types";

export class TreeUtils {

  public static getBranch(nodeId: string, nodes: Node[]): Node[] {
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

  public static calculateNodePosition({ left, top }: { left: number; top: number }): React.CSSProperties {
    return {
      width: TreeConfig.nodeWidth,
      height: TreeConfig.nodeHeight,
      transform: `translate(${left * (TreeConfig.nodeWidth / 2)}px, ${top * (TreeConfig.nodeHeight / 2)}px)`
    };
  }

  public static calculateFounderNodePosition({ left, top }: { left: number; top: number }): React.CSSProperties {
    return {
      width: TreeConfig.founderNodeWidth,
      height: TreeConfig.founderNodeHeight,
      transform: `translate(${left * (TreeConfig.founderNodeWidth / 2)}px, ${top * (TreeConfig.founderNodeHeight / 2)}px)`
    };
  }

  public static getMemberById(id: string, members: Node[]): Node | undefined {
    return members.find(member => member.id === id);
  }
}