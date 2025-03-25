import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { CommonIcon, Header, ScrollableDiv, Selection } from "components";

import { UIAncestralOfferingForm } from "./ancestral-offering-letter/UIForm";

export function UIRitualScript() {
  const [ scriptContainer, setContainer ] = React.useState<React.ReactNode>(
    <UIAncestralOfferingForm/>
  );

  const options: any[] = [
    { value: 1, label: "Lễ Gia Tiên" }
  ]

  return (
    <>
      <Header title={t("ritual_script")}/>

      <div className="container bg-white flex-v">

        <div>
          <Text.Title className="my-2 text-primary text-capitalize">
            {t("chọn loại sớ")}
          </Text.Title>
          <Selection 
            options={options}
            defaultValue={options[0]}
            isClearable={false}
            isSearchable={false}
            onChange={() => console.log("on change")} 
            label={""} field={""} 
            observer={null as any}          
          />
        </div>

        <ScrollableDiv direction="vertical" className="flex-v">
          {scriptContainer}
        </ScrollableDiv>

      </div>
    </>
  )
}