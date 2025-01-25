import React from "react";
import { t } from "i18next";
import Select, { StylesConfig, ActionMeta } from "react-select";

import { BeanObserver } from "components";

interface SelectionDefaultValue {
  value: any; 
  label: string;
}

interface SelectionProps {
  label: string;
  field: string;
  options: SelectionDefaultValue[];
  observer: BeanObserver<any>;
  defaultValue?: SelectionDefaultValue;
  isClearable?: boolean;
  isSearchable?: boolean;
}
export function Selection(props: SelectionProps) {
  const { 
    options = [ { value: "", label: t("unknown") } ], 
    defaultValue = options[0], 
    isClearable = false, 
    isSearchable = false,
    observer, field, label
  } = props;

  const onSelect = (value: any, action: ActionMeta<any>) => {
    observer.update(field, value.value);
  }

  return (
    <div className="flex-v">
      <p> {t(label)} </p>
      <Select 
        options={options}
        defaultValue={() => {
          observer.update(field, defaultValue.value)
          return defaultValue;
        }}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={colourStyles}
        onChange={onSelect}
      />
    </div>
  )
}

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