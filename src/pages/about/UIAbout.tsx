import React from "react";
import { Sheet, Button, Page, Text, useNavigate } from "zmp-ui";

export function UIAbout() {
  const [actionSheetOpened, setActionSheetOpened] = React.useState(false);
  const navigate = useNavigate();
  return (
    <Page className="page">
      <div className="section-container">
        <Text bold>Designed by MobiFone 5</Text>
      </div>
      <div className="section-container">
        <Text>
          <Text bold className="text"> Capabilities </Text>
          <p> - View Family tree structure                <span className="text success"> [Working on] </span> </p>
          <p> - View Information of family tree members   <span className="text success"> [Working on] </span> </p>
          <p> - View Media articles                       <span className="text pending"> [Pending] </span> </p>
          <p> - View Photo Albums                         <span className="text pending"> [Pending] </span> </p>
          <p> - View Event Calendar                       <span className="text pending"> [Pending] </span> </p>
          <p> - View Income and Expense fund information  <span className="text pending"> [Pending] </span></p>
          <p> - View Hall of Fame                         <span className="text pending"> [Pending] </span> </p>
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
