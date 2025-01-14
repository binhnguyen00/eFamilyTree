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
  generation: number;
}

/**
 * @description This class analyze the family data from Odoo server
 * @return Odoo server data (Person)
 */
export class TreeDataAnalyzer {
  private people: Map<number, Person>;

  constructor(data: Person[]) {
    this.people = new Map(data.map(person => [person.id, person]));
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
}