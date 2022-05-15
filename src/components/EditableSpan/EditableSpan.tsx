import React, {ChangeEvent, FC, memo, useState} from "react";
import TextField from "@material-ui/core/TextField";

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
      ? <TextField variant='outlined' size='small' value={newTitle} onBlur={onBlurHandler}
                   disabled={disabled} autoFocus onChange={onSetNewTitleHandler}/>
      : <span onDoubleClick={onDoubleClickHandler}>{title}</span>

  )
})