import { Node, Gender, RelType, Relation } from "components/tree-relatives/types";

export interface OdooTreeMember {
  id          : number;
  code        : string;
  name        : string;
  avatar      : string;
  gender      : "1" | "0";  // 1: male, 0: female
  fid         : number;     // father id. could be 0 if has no father
  mid         : number;     // mother id. could be 0 if has no mother
  pids        : number[];   // spouse ids. could be [] if has no spouses
  phone       : string;
  is_alive    : boolean;
  generation  : number;
}

/**
 * @description This class process the family data from Odoo server
 * @return Family Tree Nodes (Node)
 */
export class TreeDataProcessor {
  private odooMembers: OdooTreeMember[]
  public nodes: Node[];
  public rootId: string;

  constructor(data: OdooTreeMember[]) {
    if (!data.length) 
      this.odooMembers = []
    else 
      this.odooMembers = data

    if (!this.odooMembers.length) {
      this.nodes = [];
      this.rootId = "0";
    } else {
      this.nodes = this.peopleToNodes();
      this.rootId = this.getAncestor().id;
    }
  }

  public setNodes(nodes: any[]) {
    this.nodes = nodes;
    if (this.nodes.length) this.rootId = this.getAncestor().id;
  }

  public peopleToNodes(): Node[] {
    let nodes: Node[] = [];
    this.odooMembers.map((person: OdooTreeMember) => {
      nodes.push(this.personToNode(person));
    })
    return nodes;
  }

  public getAncestor(): Node {
    const target = this.nodes.find((node: Node) => {
      return (
        node.parents.length === 0 
          && node.gender === Gender.male 
          && node.generation === 1
      )
    })
    if (!target) return this.nodes[0];
    else return target;
  }

  public getNode(id: string): Node | null {
    const target = this.odooMembers.find((person: OdooTreeMember) => {
      return person.id.toString() === id;
    })
    if (!target) return null;
    const node = this.personToNode(target);
    return node;
  }

  public getSpouses(id: number) {
    const targetPerson = this.odooMembers.find((person: OdooTreeMember) => person.id === id);
    if (!targetPerson) return [];
    const spouses = targetPerson.pids
      .map((spouseId: number) => this.odooMembers.find((person: OdooTreeMember) => person.id === spouseId))
      .filter((spouse: OdooTreeMember | undefined) => spouse !== undefined)
      .map((spouse: OdooTreeMember) => this.personToNode(spouse));
    return spouses || [];
  }

  private personToNode(person: OdooTreeMember): Node {
    return {
      id         : person.id.toString(),
      gender     : person.gender === "1" ? Gender.male : Gender.female,
      name       : person.name,
      avatar     : person.avatar,
      generation : person.generation,
      isAlive    : person.is_alive,
      parents    : this.getParentRelations(person),
      children   : this.getChildrenRelations(person),
      siblings   : this.getSiblingRelations(person),
      spouses    : this.getSpouseRelations(person),
    }
  }

  private getParentRelations(target: OdooTreeMember): Relation[] {
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

  private getChildrenRelations(target: OdooTreeMember): Relation[] {
    let childen: Relation[] = new Array();
    this.odooMembers
      .filter((person: OdooTreeMember) => { // filter out children
        return person.fid === target.id || person.mid === target.id;
      })
      .map((child: OdooTreeMember) => { // map children
        childen.push({
          id: child.id.toString(),
          type: RelType.blood
        });
      });
    return childen;
  }

  private getSiblingRelations(target: OdooTreeMember): Relation[] {
    let siblings: Relation[] = new Array();
    this.odooMembers
      .filter((person: OdooTreeMember) => { // filter out siblings
        return (
          (person.id !== target.id) && 
          (
            (target.fid && person.fid === target.fid) || 
            (target.mid && person.mid === target.mid)
          )
        )
      })
      .map((sibling: OdooTreeMember) => { // map siblings
        siblings.push({
          id: sibling.id.toString(),
          type: (target.fid === sibling.fid) && (target.mid === sibling.mid)
            ? RelType.blood
            : RelType.half
        })
      })
    return siblings;
  }

  private getSpouseRelations(person: OdooTreeMember): Relation[] {
    let spouses: Relation[] = new Array();
    person.pids.map((spouseId: number) => {
      spouses.push({
        id: spouseId.toString(),
        type: RelType.married
      });
    })
    return spouses;
  }

  public getMaxGeneration(): number {
    const generations = Array.from(this.nodes.values()).map(node => node.generation);
    return generations.length > 0 ? Math.max(...generations) : 0;
  }

  public getNodesByGeneration(generation: number) {
    return this.nodes.filter(node => node.generation === generation);
  }
}