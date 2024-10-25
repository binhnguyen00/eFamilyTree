import React from "react";
import { Header } from "zmp-ui";

export class CommonUtils {
  
  public static renderHeader(title: string, showBackIcon: boolean = true) {
    return (
      <>
        <Header title={title} showBackIcon={showBackIcon}/>
        {/* Break bcuz of the Header is overlaping with content */}
        <br />
        <br />
      </>
    )
  }

}