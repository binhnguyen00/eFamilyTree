import React from "react";

import { t } from "i18next";

import { Header } from "components";
import { Tree } from "components/tree-2.0/Tree";

export function UITree() {
  return (
    <>
      <Header title={t("tree")}/>

      <Tree />
    </>
  )
}