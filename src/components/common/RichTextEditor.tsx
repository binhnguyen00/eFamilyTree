import React from "react";
import classNames from "classnames";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { BeanObserver } from "components";

interface RichTextEditorProps<T extends Record<string, any>> {
  field: keyof T;
  observer: BeanObserver<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor<T extends Record<string, any>>(props: RichTextEditorProps<T>) {
  const { field, label, observer, className, disabled, placeholder = "nội dung..." } = props;
  const [ editorValue, setEditorValue ] = React.useState<string>(observer.getFieldValue(field.toString()));

  const onChange = (value: string) => {
    if (value === "<p><br></p>") {
      setEditorValue("");
      observer.update(field, "" as T[keyof T]);
      return;
    }
    setEditorValue(value);
    observer.update(field, value as T[keyof T]);
  }

  const onLimitation = () => {
    // check if editorValue has more than 3 images
  }

  return (
    <div>
      {label && <p className="text-capitalize text-primary pb-2"> {label} </p>}
      <ReactQuill 
        theme="snow"
        placeholder={placeholder}
        className={classNames("text-base", "h-full", className)}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }}
        formats={[
          "header",
          "bold", "italic", "underline",
          "list", "bullet",
          "link", "image"
        ]}
        value={editorValue}
        onChange={onChange}
        readOnly={disabled}
      />
    </div>
  )
}