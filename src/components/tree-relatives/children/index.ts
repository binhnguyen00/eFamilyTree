import type Store from '../store';
import { withType } from '../utils/family';
import { hasChildren, nodeIds } from '../utils/units';
import { Family, FamilyType, Unit } from '../types';
import { createFamilyFunc } from './create';
import { updateFamilyFunc } from './update';
import { arrangeFamiliesFunc } from './arrange';

const getUnitsWithChildren = (family: Family): Unit[] => {
  return family.children.filter(hasChildren).reverse();
}

export const inChildDirection = (store: Store): Store => {
  const createFamily = createFamilyFunc(store);
  const updateFamily = updateFamilyFunc(store);
  const arrangeFamilies = arrangeFamiliesFunc(store);

  const rootFamilies = store.familiesArray.filter(withType(FamilyType.root));

  rootFamilies.forEach((rootFamily) => {
    let stack: Unit[] = getUnitsWithChildren(rootFamily);
    const visitedUnits = new Set<Unit>(); // Track processed units to avoid duplicates

    while (stack.length) {
      const parentUnit = stack.pop()!;

      if (visitedUnits.has(parentUnit)) continue;
      visitedUnits.add(parentUnit);

      const family = createFamily(nodeIds(parentUnit), FamilyType.child);
      updateFamily(family, parentUnit);
      arrangeFamilies(family);

      store.families.set(family.id, family);

      const newChildren = getUnitsWithChildren(family).filter(unit => !visitedUnits.has(unit));
      stack = stack.concat(newChildren);
    }
  });

  return store;
};