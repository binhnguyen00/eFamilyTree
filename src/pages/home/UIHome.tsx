import React from "react";
import { Page, useNavigate, Grid } from "zmp-ui";

export function UIHomePage() {
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
  };

  return (
    <Page className="page">
      
    </Page>
  );
};