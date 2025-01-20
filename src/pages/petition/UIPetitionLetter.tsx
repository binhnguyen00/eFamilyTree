import React from "react";
import { t } from "i18next";
import Select, { StylesConfig } from "react-select";

import { Divider, Header } from "components";

import { UIPetitionLetterForm } from "./UIPetitionLetterForm";

const options: any[] = [
  { value: 1, label: "Lễ Gia Tiên" }
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
  const [ form, setForm ] = React.useState<React.ReactNode>(
    <UIPetitionLetterForm/>
  );

  return (
    <div className="container">

      <Header title={t("petition_letter")}/>

      <div>
        <div>
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

        {form}

      </div>
    </div>
  )
}