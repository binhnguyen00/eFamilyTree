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
  defaultValue?: Date;
}
export function DatePicker(props: DatePickerProps) {
  const { field, observer, label, defaultValue } = props; 
  const [ value, setValue ] = React.useState(defaultValue);

  const onChange = (value: Date) => {
    setValue(value);
    observer.update(field, DateTimeUtils.formatToDate(value));
  }

  return (
    <div className="flex-v flex-grow-0">
      <span className="text-primary"> {t(label)} </span>
      <ReactDatePicker
        format="dd/MM/yyyy"
        value={value}
        maxDate={new Date()}
        name={field}
        onChange={onChange}
        locale="vi-VN"
      />
    </div>
  )
}