import React from "react";
import { Box, Button, Grid, Modal, Page, Text } from "zmp-ui";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";

export function UIFamilyTree() {
  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Family Tree")}

      <UIFamilyTreeView/>
    </Page>
  )
}

interface IFamilyMember {
  id: number;
  name: string;
  parentId: boolean | any[];
  spouseData: null | { id: number, name: string, gioi_tinh: "nam" | "nu" }; // Dữ liệu vợ, chồng 
  gioi_tinh: "nam" | "nu";
  children?: IFamilyMember[];
}

export function UIFamilyTreeView() {
  const [ reload, setReload ] = React.useState(false);
  const [ ancestor, setAncestor ] = React.useState<IFamilyMember | null>(null);

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) setAncestor(data);
    }
    EFamilyTreeApi.getMembers("0942659016", success);
  }, [ reload ]);

  const handleShowMemberDetail = (memId: number) => {
    // Get detail member info by id from server
  }

  const renderTree = (member: IFamilyMember | null): JSX.Element => {
    if (!member) {
      return (
        <Box flex flexDirection="column" alignItems="center" justifyContent="center">
          <Text.Title> {"Found no members"} </Text.Title>
          <Button size="small" onClick={() => setReload(!reload)}> {"Retry"} </Button>
        </Box>
      );
    }

    return (
      <></>
    );
  };

  return (
    <React.Fragment>
      {ancestor ? renderTree(ancestor) : <Box flex justifyContent="center"> {"Getting Member..."} </Box>}
    </React.Fragment>
  )
}