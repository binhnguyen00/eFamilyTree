import React from "react";
import { t } from "i18next";
import { Stack, Text } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

export function UIAbout() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("about"))}

      <Stack>
        <Text bold>Designed by MobiFone 5</Text>
        <Text bold className="text"> Capabilities </Text>
        <Text>
          <p> - View Family tree structure                <span className="text success"> [Working on] </span> </p>
          <p> - View Information of family tree members   <span className="text success"> [Working on] </span> </p>
          <p> - View Media articles                       <span className="text pending"> [Pending] </span> </p>
          <p> - View Photo Albums                         <span className="text pending"> [Pending] </span> </p>
          <p> - View Event Calendar                       <span className="text pending"> [Pending] </span> </p>
          <p> - View Income and Expense fund information  <span className="text pending"> [Pending] </span></p>
          <p> - View Hall of Fame                         <span className="text pending"> [Pending] </span> </p>
        </Text>
      </Stack>
    </div>
  );
};
