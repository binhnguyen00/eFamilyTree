import React from "react";
import { t } from "i18next";
import { IoIosArrowBack } from "react-icons/io";
import { Box, Input, Spinner, Text, useNavigate, Stack, Button, Header } from "zmp-ui";

interface SearchBar {
  placeholder?: string;
  onSearch?: (
    text: string, 
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

// TODO: Clean code, turn function into React Function
export class CommonComponentUtils {
  public static renderHeader(title: string, subtitle?: string, logo?: React.ReactNode, showBackIcon: boolean = true) {
    let navigate = useNavigate();

    return (
      <Box flex flexDirection="row" justifyContent="flex-start">
        <Box
          className="zaui-header"
          flex flexDirection="row" justifyContent="flex-start" alignContent="center" alignItems="center"
        >
          {showBackIcon && (
            <IoIosArrowBack 
              className="button-bounce" size={"1.5rem"} 
              onClick={() => {
                navigate(-1);
              }}
            />
          )}
          <Box flex flexDirection="row" justifyContent="flex-start">
            {logo && (logo)}
            <Stack>
              <Text.Title style={{ textTransform: "capitalize" }}>
                {title}
              </Text.Title>
              <Text size="xSmall">{subtitle}</Text>
            </Stack>
          </Box>
        </Box>
      </Box>
    )
  }

  public static renderSearchBar(searchBar: SearchBar) {
    const isEmpty = (obj: SearchBar) => Object.keys(obj).length === 0;
    if (isEmpty(searchBar)) return <></>;
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

  public static renderLoading(message: string) {
    return (
      <Box flex flexDirection="column" justifyContent="center" alignItems="center">
        <Spinner visible/>
        <Text.Title style={{
          textTransform: "capitalize",
        }} size="small"> {message} </Text.Title>
      </Box>
    )
  }

  public static renderError(message: string, onRetry?: () => void) {
    return (
      <Stack space="0.5rem" style={{
        textTransform: "capitalize"
      }} className="center">
        <Text.Title size="normal"> {message} </Text.Title>
        {onRetry && (
          <Button 
            size="small" onClick={onRetry}
          > {t("retry")} </Button>
        )}
      </Stack>
    )
  }

  public static renderRetry(message: string, onRetry?: () => void) {
    return (
      <Stack space="0.5rem" style={{
        textTransform: "capitalize"
      }}>
        <Text.Title size="normal"> {message} </Text.Title>
        {onRetry && (
          <Button 
            size="small" onClick={onRetry}
          > {t("retry")} </Button>
        )}
      </Stack>
    )
  }
}