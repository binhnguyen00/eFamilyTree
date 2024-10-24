import React from "react";
import { Page, useNavigate, Grid } from "zmp-ui";

import { UIDummyUser, UIDummyUserForm } from "../dummy/UIDummyUser";

export function UIHomePage() {
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
  };

  const renderFunctions = () => {
    const functions = ["about", "family-tree", "todo"];
    let html = [] as React.ReactNode[];
    functions.forEach((key) => {
      const element = (
        <button 
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
      <UIDummyUser/>
      <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
        {renderFunctions()}
      </Grid>
    </Page>
  );
};