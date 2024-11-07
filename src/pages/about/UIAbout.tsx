import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

export function UIAbout() {
  const { t } = useTranslation();
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("about"))}

      <div className="container">
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
      </div>
    </div>
  );
};
