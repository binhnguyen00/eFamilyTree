import React from "react";
import { t } from "i18next";
import { DatePicker as ReactDatePicker } from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

import { BeanObserver } from "components/bean-observer";
import { DateTimeUtils } from "utils";

interface DatePickerProps {
  field: string;
  label: string;
  observer: BeanObserver<any>;
  maxDate?: Date;
  defaultValue?: Date;
  value?: Date;
  onChange?: (value: Date) => void;
}
export function DatePicker(props: DatePickerProps) {
  const { field, observer, label, defaultValue, onChange, maxDate } = props; 
  const [ value, setValue ] = React.useState(observer.getFieldValue(field) || defaultValue);

  const onSelectDate = onChange 
    ? (value: Date) => {
      setValue(value);
      onChange(value);
    } 
    : (value: Date) => {
      setValue(value);
      observer.update(field, DateTimeUtils.formatToDate(value));
    }

  return (
    <div className="flex-v flex-grow-0">
      <span className="text-primary"> {t(label)} </span>
      <ReactDatePicker
        className={"bg-white text-base"}
        format="dd/MM/yyyy"
        value={value}
        maxDate={maxDate ? maxDate : new Date()}
        name={field}
        onChange={onSelectDate}
        locale="vi-VN"
      />
    </div>
  )
}