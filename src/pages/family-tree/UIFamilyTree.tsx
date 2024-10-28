import React from "react";
import familyMembers from './members.json'; // Import JSON
import { Button, Grid, Modal } from "zmp-ui";
import { CommonComponentUtils } from "../../utils/CommonComponent";

interface IFamilyMember {
  id: number
  name: string
  birthYear: number
  description: string
  children?: IFamilyMember[]
}

function renderTree(ancestor: IFamilyMember) {
  let [ modalVisible, setModalVisible ] = React.useState(false);
  let grid = [] as React.ReactNode[];
  // Need to find total number of rows

  const handleShowMemberDetail = (memId: number) => {
    // Get detail member info by id from server
    // Update data
    setModalVisible(true);
  }

  const numberOfChild = 200;
  for (let idx = 1; idx <= numberOfChild; idx++) {
    grid.push(
      <div key={idx} 
        className="button section-container" style={{ height: "5em", width: "10em" }}
        onClick={() => handleShowMemberDetail(idx)}
      >
        {`Mem ${idx}`}
      </div>
    )
  }

  return (
    <Grid columnSpace="1rem" rowSpace="1rem" columnCount={20}>
      {grid}

      <Modal
        visible={modalVisible}
        title="Member Summary"
        coverSrc={"https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8"}
        onClose={() => setModalVisible(false)}
        zIndex={1001}
        actions={[
          { text: "Close", close: true },
        ]}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
      />
    </Grid>
  )
}

export function UIFamilyTree() {
  const members: IFamilyMember = familyMembers;
  return (
    <div>
      {CommonComponentUtils.renderHeader("Family Tree")}
      <div className="page scrollable">
        {renderTree(members)}
      </div>
    </div>
  )
}
