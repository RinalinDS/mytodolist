import React, {ChangeEvent, FC, memo, useState} from "react";
import styled from 'styled-components';

const StyledInput = styled.input`
  font: inherit;
  letter-spacing: inherit;
  border: 0;
  box-sizing: content-box;
  background: none;
  height: 1.4375em;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0;
  width: 80%;
  padding: 8.5px 14px;
`

type EditableSpanPropsType = {
  title: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

export const EditableSpan: FC<EditableSpanPropsType> = memo(({title, onChange, disabled}) => {


  let [edit, setEdit] = useState(false)
  let [newTitle, setNewTitle] = useState(title)

  const onDoubleClickHandler = () => {
    setEdit(true)
  }

  const onBlurHandler = () => {
    setEdit(false)
    onChange(newTitle)
  }

  const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.currentTarget.value)

  return (
    edit
      ? <StyledInput disabled={disabled} value={newTitle} onBlur={onBlurHandler}
                     autoFocus onChange={onSetNewTitleHandler}/>
      : <span style={{padding: '8.5px 7px', width: '70%'}} onDoubleClick={onDoubleClickHandler}>{title}</span>

  )
})