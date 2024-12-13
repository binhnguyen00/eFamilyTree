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

/**
 * @description This class process the family data from Odoo server
 * @return Family Tree Nodes (Node)
 */
export class TreeDataProcessor {
  private people: Person[]
  public nodes: Node[];
  public rootId: string;

  constructor(data: Person[]) {
    this.people = data;
    if (!data.length) {
      this.nodes = [{
        id: "0",
        name: "Thành Viên",
        gender: Gender.male,
        parents: [],
        children: [],
        siblings: [],
        spouses: []
      }];
      this.rootId = "0";
    } else {
      this.nodes = this.peopleToNodes();
      this.rootId = this.getAncestor().id;
    }
  }

  public peopleToNodes(): Node[] {
    let nodes: Node[] = [];
    this.people.map((person: Person) => {
      nodes.push(this.personToNode(person));
    })
    return nodes;
  }

  public getAncestor(): Node {
    const target = this.nodes.find((node: Node) => {
      return node.parents.length === 0 && node.gender === Gender.male;
    })
    if (!target) return this.nodes[0];
    else return target;
  }

  public getNode(id: string): Node | null {
    const target = this.people.find((person: Person) => {
      return person.id.toString() === id;
    })
    if (!target) return null;
    const node = this.personToNode(target);
    return node;
  }

  // ============================================
  // Private
  // ============================================
  private personToNode(person: Person): Node {
    return {
      id: person.id.toString(),
      gender: person.gender === "1" ? Gender.male : Gender.female,
      name: person.name,
      avatar: person.img,
      parents: this.getParentRelations(person),
      children: this.getChildrenRelations(person),
      siblings: this.getSiblingRelations(person),
      spouses: this.getSpouseRelations(person),
    }
  }

  private getParentRelations(target: Person): Relation[] {
    const relations: Relation[] = [];
    if (target.fid) {
      relations.push({
        id: target.fid.toString(),
        type: RelType.blood
      });
    }
    if (target.mid) {
      relations.push({
        id: target.mid.toString(),
        type: RelType.blood
      });
    }
    return relations;
  }

  private getChildrenRelations(target: Person): Relation[] {
    let childen: Relation[] = new Array();
    this.people
      .filter((person: Person) => { // filter out children
        return person.fid === target.id || person.mid === target.id;
      })
      .map((child: Person) => { // map children
        childen.push({
          id: child.id.toString(),
          type: RelType.blood
        });
      });
    return childen;
  }

  private getSiblingRelations(target: Person): Relation[] {
    let siblings: Relation[] = new Array();
    this.people
      .filter((person: Person) => { // filter out siblings
        return (
          (person.id !== target.id) && 
          (
            (target.fid && person.fid === target.fid) || 
            (target.mid && person.mid === target.mid)
          )
        )
      })
      .map((sibling: Person) => { // map siblings
        siblings.push({
          id: sibling.id.toString(),
          type: (target.fid === sibling.fid) && (target.mid === sibling.mid)
            ? RelType.blood
            : RelType.half
        })
      })
    return siblings;
  }

  private getSpouseRelations(person: Person): Relation[] {
    let spouses: Relation[] = new Array();
    person.pids.map((spouseId: number) => {
      spouses.push({
        id: spouseId.toString(),
        type: RelType.married
      });
    })
    return spouses;
  }
}