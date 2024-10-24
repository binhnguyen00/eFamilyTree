import React from "react";
import { Header } from "zmp-ui";

export function renderHeader(title: string, showBackIcon: boolean = true) {
  return (
    <>
      <Header title={title} showBackIcon={showBackIcon}/>
      {/* Break cuz of the Header is overlaping with content */}
      <br />
      <br />
    </>
  )
}