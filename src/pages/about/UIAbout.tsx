import React from "react";
import { Sheet, Button, Page, Text, useNavigate } from "zmp-ui";

export function UIAbout() {
  const [actionSheetOpened, setActionSheetOpened] = React.useState(false);
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="section-container">
        <Text bold>This app was designed by MobiFone 5</Text>
      </div>
      <div className="section-container">
        <Text>
          <Text bold className="text"> Capabilities </Text>
          <p> - View family tree                          <span className="text success"> [On Going] </span> </p>
          <p> - View information of family tree members   <span className="text success"> [On Going] </span> </p>
          <p> - View media articles                       <span className="text pending"> [Pending] </span> </p>
          <p> - View photo albums                         <span className="text pending"> [Pending] </span> </p>
          <p> - View event calendar                       <span className="text pending"> [Pending] </span> </p>
          <p> - View income and expense fund information  <span className="text pending"> [Pending] </span></p>
          <p> - View honor board                          <span className="text pending"> [Pending] </span> </p>
        </Text>
      </div>
      <div>
        <Button variant="secondary" fullWidth onClick={() => setActionSheetOpened(true)}>
          {"Actions"}
        </Button>
      </div>
      <Sheet.Actions
        visible={actionSheetOpened}
        onClose={() => setActionSheetOpened(false)}
        actions={[
          [
            {
              text: "Go back",
              onClick: () => {
                navigate(-1);
              },
            },
            {
              text: "Action 1",
              close: true,
            },
            {
              text: "Action 2",
              close: true,
            },
          ],
          [
            {
              text: "Close",
              close: true,
              danger: true,
            },
          ],
        ]}/>
    </Page>
  );
};