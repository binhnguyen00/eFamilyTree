import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, Box, Input, Stack } from "zmp-ui";
import { atom, selector, useRecoilValue, useRecoilState } from "recoil"

import { BaseServer, UserSettingApi } from "api";
import { Header, Loading } from "components";
import { FailResponse, ServerResponse } from "server";

const numberState = atom({
  key: "number",
  default: 0
})

const numberSelector = selector({
  key: "numberSelector",
  get: ({ get }) => {
    const value = get(numberState)
    return value
  }
})

const textState = atom({
  key: "text",
  default: ""
})

const textSelector = selector({
  key: "textSelector",
  get: ({ get }) => {
    const value = get(textState)
    return value
  }
})

const todo = atom<string[]>({
  key: "todo",
  default: []
})

const todoSelector = selector({
  key: "todoSelector",
  get: ({ get }) => {
    const value = get(todo)
    return value
  }
})

export function UIPlayground() {
  const { t, i18n } = useTranslation();
  const [ number, setState ] = useRecoilState(numberState);
  const numberValue = useRecoilValue(numberSelector);

  const [ text, setText ] = useRecoilState(textState);
  const textValue = useRecoilValue(textSelector);

  const [ todoList, setTodoList ] = useRecoilState(todo);
  const todoListValue = useRecoilValue(todoSelector);

  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

      <Stack space="1rem">
        <Box flex justifyContent="space-between">
          <Button variant="secondary" onClick={() => setState(number + 1)} size="small">
            + Add
          </Button>
          <Button variant="secondary" onClick={() => setState(number - 1)} size="small">
            - Remove
          </Button>
          <Button variant="secondary" onClick={() => setState(0)} size="small">
            Reset
          </Button>
        </Box>
        <Input value={numberValue}/>
      </Stack>

      <Stack space="1rem">
        <Input
          value={text} placeholder="Input"
          onChange={(e) => setText(e.target.value)}/>
        <Input 
          value={textValue} placeholder="Output"/>
        <Box flex justifyContent="space-evenly">
          <Button variant="secondary" size="small" onClick={() => {
            setTodoList([...todoList, text]) 
            setText("")
          }}> + Add </Button>
          <Button variant="secondary" size="small" onClick={() => { setTodoList([]) }}> Reset </Button>
        </Box>
        <Input.TextArea value={todoListValue}/>
      </Stack>

      <Stack space="1rem">
        <Text.Title size="large"> {t("playground_translate")} </Text.Title>
        <Button variant="secondary" onClick={() => i18n.changeLanguage("vi")}>
          {t("vietnamese")}
        </Button>
        <Button variant="secondary" onClick={() => i18n.changeLanguage("en")}>
          {t("english")}
        </Button>
      </Stack>
      
      <Stack space="1rem">
        <Text.Title size="large"> {"Mock CORS"} </Text.Title>
        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            console.log(result);
          } 
          const fail = (error: FailResponse) => {
            console.error(error);
          }
          BaseServer.mockHTTP(success, fail);
        }}>
          {"HTTP"}
        </Button>
      </Stack>

      <Stack space="1rem">
        <Text.Title size="large"> {"Test Settings API"} </Text.Title>
        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            console.log(result);
          } 
          const fail = (error: FailResponse) => {
            console.error(error);
          }
          UserSettingApi.getOrDefault("0942659016", success, fail);
        }}>
          {"Get Settings"}
        </Button>
      </Stack>
      
      <Loading/>

    </Stack>
  )
}