import React from "react";
import { Input } from "zmp-ui";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (
    text: string, 
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

export default function UISearchBar(props: SearchBarProps) {
  let { onSearch, placeholder } = props;
  if (!onSearch) {
    onSearch = (value: any, event: any) => {
      console.log(event.target.value);
    }
  }
  return (
    <Input.Search
      placeholder={placeholder || "..."}
      onSearch={onSearch}
    />
  )
}