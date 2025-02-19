import React from "react";
import { t } from "i18next";
import Select, { StylesConfig, ActionMeta, MultiValue, SingleValue } from "react-select";

import { BeanObserver } from "components";

interface SelectionOption {
  value: any;
  label: string;
}

interface SelectionProps {
  label: string;
  field: string;
  options: SelectionOption[];
  observer: BeanObserver<any>;
  value?: SelectionOption | SelectionOption[];
  placeHolder?: string;
  defaultValue?: SelectionOption | SelectionOption[];
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  onChange?: (value: SelectionOption | SelectionOption[] | null, action: ActionMeta<SelectionOption>) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function Selection(props: SelectionProps) {
  const {
    options = [{ value: "", label: t("select") }],
    defaultValue = options[0],
    isClearable = false,
    isSearchable = false,
    placeHolder = `${t("select")}...`,
    observer,
    field,
    label,
    isMulti,
    isDisabled,
    onChange,
    value,
    style,
    className,
  } = props;

  const handleChange = (
    selectedOption: SingleValue<SelectionOption> | MultiValue<SelectionOption>,
    action: ActionMeta<SelectionOption>
  ) => {
    if (onChange) {
      onChange(selectedOption as SelectionOption | SelectionOption[] | null, action);
    } else {
      if (isMulti) {
        const selectedValues = (selectedOption as SelectionOption[]).map(opt => opt.value);
        observer.update(field, selectedValues);
      } else {
        const selectedValue = (selectedOption as SelectionOption)?.value;
        observer.update(field, selectedValue);
      }
    }
  };

  const getDefaultValue = () => {
    if (isMulti) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return defaultValue;
  };

  return (
    <div className={`flex-v flex-grow-0 ${className && className}`.trim()} style={style}>
      {label && <p>{t(label)}</p>}
      <Select
        isMulti={isMulti}
        options={options}
        placeholder={placeHolder}
        defaultValue={getDefaultValue()}
        value={value}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={colourStyles}
        onChange={handleChange}
        isDisabled={isDisabled}
        noOptionsMessage={() => {
          return t("không tìm thấy");
        }}
      />
    </div>
  );
}

const colourStyles: StylesConfig<any> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#999",
    },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: "black",
    backgroundColor: isSelected ? "#e2e8f0" : isFocused ? "#f1f5f9" : "white",
    ":active": {
      backgroundColor: "#cbd5e1",
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#e2e8f0",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "black",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#64748b",
    ":hover": {
      backgroundColor: "#94a3b8",
      color: "white",
    },
  }),
};