import React from "react";
import { Page, useNavigate, Grid, Button } from "zmp-ui";
import { UIDummyUser } from "../dummy/UIDummyUser";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIHomePage() {
  let navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
    navigate = undefined as any;
  };

  const renderFunctions = () => {
    // keys should be same as Route in ../main.tsx
    const funcKeyMap = {
      "about": "About",
      "family-tree": "Family Tree",
      "album": "Album",
      "calendar": "Calendar",
      "upcoming": "Upcoming",
      "playground": "Playground",
    }
    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <Button 
          key={key} variant="secondary" className="box-shadow" style={{ height: 150, borderRadius: 12 }} 
          onClick={() => handleTabChange(key)}
        > 
          {funcKeyMap[key]} 
        </Button>
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