import React from "react";
import familyMembers from './members.json'; // Import JSON
import { Grid } from "zmp-ui";

interface IFamilyMember {
  id: number
  name: string
  birthYear: number
  description: string
  children?: IFamilyMember[]
}

function renderTree(ancestor: IFamilyMember) {
  let grid = [] as React.ReactNode[];
  // Need to find total number of rows

  const numberOfChild = 100;
  for (let i = 1; i <= numberOfChild; i++) {
    grid.push(
      <div key={i} className="section-container" style={{ height: 50 }}>
        Cell
      </div>
    )
  }

  return (
    <Grid columnSpace="1rem" rowSpace="1rem" columnCount={20}>
      {grid}
    </Grid>
  )
}

export function UIFamilyTree() {
  const members: IFamilyMember = familyMembers;
  console.log(members);

  return (
    <div className="page scrollable">
      {renderTree(members)}
    </div>
  )
}
