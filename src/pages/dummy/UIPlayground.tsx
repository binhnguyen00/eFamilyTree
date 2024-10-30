import React from "react";
import { Button, Text, Page, Box, Input, Stack } from "zmp-ui";
import { atom, selector, useRecoilValue, useRecoilState } from "recoil"
import { CommonComponentUtils } from "utils/CommonComponent";
import { UIDummyTree } from "./UIDummyTree";

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
  const [ number, setState ] = useRecoilState(numberState);
  const numberValue = useRecoilValue(numberSelector);

  const [ text, setText ] = useRecoilState(textState);
  const textValue = useRecoilValue(textSelector);

  const [ todoList, setTodoList ] = useRecoilState(todo);
  const todoListValue = useRecoilValue(todoSelector);

  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Playground")}

      <Stack className="section-container" space="1rem">
        <Box flex justifyContent="space-between">
          <Button onClick={() => setState(number + 1)} size="small">
            + Add
          </Button>
          <Button onClick={() => setState(number - 1)} size="small">
            - Remove
          </Button>
          <Button onClick={() => setState(0)} size="small">
            Reset
          </Button>
        </Box>
        <Input value={numberValue}/>
      </Stack>

      <Stack className="section-container" space="1rem">
        <Input
          value={text} placeholder="Input"
          onChange={(e) => setText(e.target.value)}/>
        <Input 
          value={textValue} placeholder="Output"/>
        <Box flex justifyContent="space-evenly">
          <Button size="small" onClick={() => {
            setTodoList([...todoList, text]) 
            setText("")
          }}> + Add </Button>
          <Button size="small" onClick={() => { setTodoList([]) }}> Reset </Button>
        </Box>
        <Input.TextArea value={todoListValue}/>
      </Stack>

      <div className="section-container">
        <UIDummyTree/>
      </div>

    </Page>
  )
}