import React from "react";
import classNames from "classnames";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { BeanObserver, Label } from "components";

interface RichTextEditorProps<T extends Record<string, any>> {
  field: keyof T;
  observer: BeanObserver<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  height?: number | string;
}

export function RichTextEditor<T extends Record<string, any>>(props: RichTextEditorProps<T>) {
  const { field, label, observer, className, disabled, placeholder = "nội dung...", height = 150 } = props;
  const [ editorValue, setEditorValue ] = React.useState<string>(observer.getFieldValue(field.toString()));

  const quillRef = React.useRef<ReactQuill>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const toolbarStyles = `
    .scrollable-toolbar .ql-toolbar {
      white-space: nowrap;
      flex-wrap: nowrap;
    }
    
    .scrollable-toolbar .ql-formats {
      display: inline-block;
      float: none;
    }
  `;

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

  /**@override toolbar */
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = toolbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  /**@override quill container */
  React.useEffect(() => {
    if (!quillRef.current || !wrapperRef.current) return;

    const quillElement = wrapperRef.current.querySelector('.quill') as HTMLElement;
    const toolbarElement = wrapperRef.current.querySelector('.ql-toolbar') as HTMLElement;
    const containerElement = wrapperRef.current.querySelector('.ql-container') as HTMLElement;

    if (!quillElement || !toolbarElement || !containerElement) return;

    if (disabled) {
      // hide toolbar
      if (toolbarElement) toolbarElement.style.display = 'none';
      containerElement.style.height = typeof height === 'number' ? `${height}px` : height;
      quillElement.style.height = typeof height === 'number' ? `${height}px` : height;
    } else {
      // show toolbar
      if (toolbarElement) toolbarElement.style.display = '';
      const toolbarHeight = toolbarElement?.offsetHeight || 0;
      containerElement.style.height = typeof height === 'number' ? `${height}px` : height;
      quillElement.style.height = typeof height === 'number' 
        ? `${height + toolbarHeight}px` 
        : `calc(${height} + ${toolbarHeight}px)`;
    }

    // set heights
    const toolbarHeight = toolbarElement.offsetHeight;
    const editorHeight = typeof height === 'number' ? `${height}px` : height;
    containerElement.style.height = editorHeight;
    quillElement.style.height = typeof height === 'number' 
      ? `${height + toolbarHeight}px` 
      : `calc(${height} + ${toolbarHeight}px)`;

  }, [ height, disabled ]);

  return (
    <div ref={wrapperRef} className="scrollable-toolbar">
      {label && <Label text={label}/>}
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        placeholder={placeholder}
        className={classNames("text-base", className)}
        modules={{
          toolbar: disabled ? [] : [
            [{ "header": [1, 2, false] }],
            [ "bold", "italic", "underline" ],
            [{ "list": "ordered" }, { "list": "bullet" }],
            [{ "indent": "-1" }, { "indent": "+1" }],
            [ "image" ]
          ]
        }}
        formats={[
          "header",
          "bold", "italic", "underline",
          "list", "bullet",
          "image"
        ]}
        value={editorValue}
        onChange={onChange}
        readOnly={disabled}
      />
    </div>
  )
}