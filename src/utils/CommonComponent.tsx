import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Box, Input, Text, useNavigate } from "zmp-ui";

interface SearchBar {
  show: boolean;
  placeholder?: string;
  onSearch?: (
    text: string, 
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

export class CommonComponentUtils {
  
  public static renderHeader(title: string, showBackIcon: boolean = true) {
    /** About Zalo Header
     * height: 44px
     */

    let navigate = useNavigate();

    return (
      <>
        <Box flex flexDirection="row" justifyContent="flex-start">
          <Box 
            className="zaui-header"
            flex flexDirection="row" justifyContent="flex-start" alignContent="center" alignItems="center"
          >
            {showBackIcon && (
              <IoMdArrowRoundBack 
                className="button" size={"1.5rem"} 
                onClick={() => {
                  navigate(-1);
                  navigate = undefined as any;
                }}
              />
            )}
            <Text.Title>{title}</Text.Title>
          </Box>
        </Box>
      </>
    )
  }

  public static renderSearchBar(searchBar: SearchBar) {
    const isEmpty = (obj: SearchBar) => Object.keys(obj).length === 0;
    if (isEmpty(searchBar)) return <></>;
    if (!searchBar.show) return <></>;
    if (!searchBar.onSearch) {
      searchBar.onSearch = (text: string) => console.log(text);
    }
    return (
      <Input.Search
        placeholder={searchBar.placeholder || "..."}
        onSearch={searchBar.onSearch}
      />
    )
  }
}