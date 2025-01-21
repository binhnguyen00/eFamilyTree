import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";
import Select, { StylesConfig } from "react-select";

import { Divider, Header } from "components";

import { UIAncestralOfferingForm } from "./ancestral-offering-letter/UIForm";

const options: any[] = [
  { value: 1, label: "Lễ Gia Viên" }
]

const colourStyles: StylesConfig<any> = {
  control: (styles) => ({ 
    ...styles, 
  }),
  option: (styles) => {
    return {
      ...styles,
      backgroundColor: "var(--secondary-color)",
      color: "var(--primary-color)"
    }
  }
}

export function UIPetitionLetter() {
  const [ petitionContainer, setContainer ] = React.useState<React.ReactNode>(
    <UIAncestralOfferingForm/>
  );

  return (
    <div className="container">
      <Header title={t("petition_letter")}/>

      <div className="flex-v">
        <Text.Title>
          {"Chọn Loại Sớ"}
        </Text.Title>
        <Select 
          options={options}
          defaultValue={options[0]}
          isClearable={false}
          isSearchable={false}
          styles={colourStyles}
          onChange={() => console.log("on change")}
        />
      </div>

      <Divider size={0}/>

      <React.Fragment>
        {petitionContainer}
      </React.Fragment>
    </div>
  )
}