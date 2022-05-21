import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import {AddBox} from "@mui/icons-material";


type AddItemFormPropsType = {
  callBack: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm: FC<AddItemFormPropsType> = memo(({callBack, disabled}) => {

  let [newTaskTitle, setNewTaskTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.currentTarget.value)

  const onEnterKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) {
      setError(null)
    }
    if (e.key === 'Enter') {
      addItem()
    }
  }
  const addItem = async () => {
    if (newTaskTitle.trim()) {
      try {
        await callBack(newTaskTitle.trim())
        setNewTaskTitle("")
      } catch (error) {
        setError((error as Error).message)
      }
    } else {
      setError("Title is required")
    }
  }
  return (
    <div>
      <TextField
        variant="outlined"
        value={newTaskTitle}
        onChange={onSetNewTitleHandler}
        onKeyPress={onEnterKeyPressHandler}
        error={!!error}
        label="Title"
        helperText={error}
        disabled={disabled}
        style={{backgroundColor: 'white'}}/>
      <IconButton color='primary' onClick={addItem} disabled={disabled} style={{marginLeft: '10px'}}>
        <AddBox/>
      </IconButton>
    </div>
  )
})