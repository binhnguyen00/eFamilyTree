import { TreeConfig } from "components";
import { Node, Gender, RelType, Relation } from "components/tree-relatives/types";

interface Person {
  id: number;
  name: string;
  gender: "1" | "0";  // 1: male, 0: female
  fid: number | null;
  mid: number | null;
  img: string;
  pids: number[];
  phone: string;
  is_alive: boolean;
}

export class FamilyTreeAnalyzer {
  private people: Map<number, Person>;
  private processsor: FamilyTreeProcessor;

  constructor(data: Person[]) {
    this.people = new Map(data.map(person => [person.id, person]));
    this.processsor = new FamilyTreeProcessor(Array.from(this.people.values()));
  }

  public getTreeMembers() {
    const members = this.processsor.remapAllToTreeMembers();
    return members;
  }

  public getAncestor(): Person | null | undefined {
    const ancestor = Array.from(this.people.values()).find(person => 
      !person.fid && !person.mid && person.gender === "1"
    );
    if (!ancestor) {
      console.error("FamilyTreeAnalyzer:\n\t", "No root ancestor found in family tree");
      return;
    } else return ancestor;
  }

  public getChildren(personId: number): Person[] {
    return Array.from(this.people.values()).filter(person =>
      person.fid === personId || person.mid === personId
    );
  }

  public getSpouses(personId: number): Person[] {
    const person = this.people.get(personId);
    if (!person) return [];

    return person.pids
      .map(pid => this.people.get(pid))
      .filter((spouse): spouse is Person => spouse !== undefined);
  }

  public getSiblings(personId: number): Person[] {
    const person = this.people.get(personId);
    if (!person || (!person.fid && !person.mid)) return [];

    return Array.from(this.people.values()).filter(p =>
      p.id !== personId &&
      ((person.fid && p.fid === person.fid) ||
        (person.mid && p.mid === person.mid))
    );
  }

  public getDescendants(personId: number): Person[] {
    const descendants: Person[] = [];
    const queue = [personId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = this.getChildren(currentId);

      descendants.push(...children);
      queue.push(...children.map(child => child.id));
    }

    return descendants;
  }

  public getFamilyStatistics(): {
    totalMembers: number;
    livingMembers: number;
    deceasedMembers: number;
    maleMembers: number;
    femaleMembers: number;
    totalFamilies: number;
  } {
    const members = Array.from(this.people.values());
    const uniqueMarriages = new Set(
      members.flatMap(person =>
        person.gender === "1" ? person.pids : []
      )
    );

    return {
      totalMembers: members.length,
      livingMembers: members.filter(p => p.is_alive).length,
      deceasedMembers: members.filter(p => !p.is_alive).length,
      maleMembers: members.filter(p => p.gender === "1").length,
      femaleMembers: members.filter(p => p.gender === "0").length,
      totalFamilies: uniqueMarriages.size
    };
  }

  public getPersonDetails(personId: number): {
    person: Person | undefined,
    children: Person[],
    spouses: Person[],
    siblings: Person[],
    parents: {
      father: Person | undefined,
      mother: Person | undefined
    }
  } {
    const person = this.people.get(personId);
    if (!person) return {
      person: undefined,
      children: [],
      spouses: [],
      siblings: [],
      parents: { father: undefined, mother: undefined }
    };

    return {
      person,
      children: this.getChildren(personId),
      spouses: this.getSpouses(personId),
      siblings: this.getSiblings(personId),
      parents: {
        father: person.fid ? this.people.get(person.fid) : undefined,
        mother: person.mid ? this.people.get(person.mid) : undefined
      }
    };
  }

  // Calculate the node position for rendering
  public static calculateNodePosition({ left, top }: { left: number; top: number }): React.CSSProperties {
    return {
      width: TreeConfig.nodeWidth,
      height: TreeConfig.nodeHeight,
      transform: `translate(${left * (TreeConfig.nodeWidth / 2)}px, ${top * (TreeConfig.nodeHeight / 2)}px)`
    };
  }
}

// =================================================
// Processor
// =================================================
class FamilyTreeProcessor {
  private people: Person[];

  constructor(data: Person[]) {
    this.people = data;
  }
  
  /**
   * @description Remap the whole family tree to tree members
   */
  public remapAllToTreeMembers(): Node[] {
    return this.people.map(person => this.remapPersonToTreeMember(person));
  }

  private remapPersonToTreeMember(person: Person): Node {
    return {
      id: person.id.toString(),
      gender: person.gender === "1" ? Gender.male : Gender.female,
      name: person.name,
      avatar: person.img,
      parents: this.getParentRelations(person),
      children: this.getChildrenRelations(person),
      siblings: this.getSiblingRelations(person),
      spouses: this.getSpouseRelations(person),
    };
  }

  private getParentRelations(person: Person): Relation[] {
    const relations: Relation[] = [];

    if (person.fid) {
      relations.push({
        id: person.fid.toString(),
        type: RelType.blood
      });
    }

    if (person.mid) {
      relations.push({
        id: person.mid.toString(),
        type: RelType.blood
      });
    }

    return relations;
  }

  private getChildrenRelations(person: Person): Relation[] {
    return Array.from(this.people.values())
      .filter(p => p.fid === person.id || p.mid === person.id)
      .map(child => ({
        id: child.id.toString(),
        type: RelType.blood
      }));
  }

  private getSiblingRelations(person: Person): Relation[] {
    return Array.from(this.people.values())
      .filter(p =>
        p.id !== person.id &&
        ((person.fid && p.fid === person.fid) ||
          (person.mid && p.mid === person.mid))
      )
      .map(sibling => ({
        id: sibling.id.toString(),
        type: person.fid === sibling.fid && person.mid === sibling.mid
          ? RelType.blood
          : RelType.half
      }));
  }

  private getSpouseRelations(person: Person): Relation[] {
    return person.pids.map(spouseId => ({
      id: spouseId.toString(),
      type: RelType.married
    }));
  }
}

// =================================================
// Utils
// =================================================
export class FamilyTreeUtils {

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

  public static getMemberById(id: string, members: Node[]): Node | undefined {
    return members.find(member => member.id === id);
  }

}