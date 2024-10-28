import React from "react";
import { Page, useNavigate, Grid } from "zmp-ui";
import { UIDummyUser } from "../dummy/UIDummyUser";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIHomePage() {
  let navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
    navigate = undefined as any;
  };

  const renderFunctions = () => {
    const funcKeyMap = {
      "about": "About",
      "family-tree": "Family Tree",
      "album": "Album",
      "calendar": "Calendar",
      "upcoming": "Upcoming",
    }
    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <button 
          key={key}
          className="flex-h section-container" style={{ height: 100 }} 
          onClick={() => handleTabChange(key)}
        > 
          {funcKeyMap[key]} 
        </button>
      )
      html.push(element);
    });

    return html;
  }

  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Home", false)}
      <UIDummyUser/>
      <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
        {renderFunctions()}
      </Grid>
    </Page>
  );
};