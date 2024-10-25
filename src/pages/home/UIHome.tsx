import React from "react";
import { Page, useNavigate, Grid } from "zmp-ui";
import { UIDummyUser } from "../dummy/UIDummyUser";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIHomePage() {
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
  };

  const renderFunctions = () => {
    const functions = ["about", "family-tree", "album", "calendar", "upcoming"];
    let html = [] as React.ReactNode[];
    functions.forEach((key) => {
      const element = (
        <button 
          key={key}
          className="flex-h section-container" style={{ height: 100 }} 
          onClick={() => handleTabChange(key)}
        > 
          {key} 
        </button>
      )
      html.push(element);
    })
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