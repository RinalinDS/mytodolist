import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@mui/icons-material";


type PropsType = {
    callBack: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = memo((props: PropsType) => {

    let [newTaskTitle, setNewTaskTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.currentTarget.value)

    const onEnterKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) {
            setError(null)
        }
        if (e.charCode === 13) {
            addItem()
        }
    }
    const addItem = () => {
        if (newTaskTitle.trim()) {
            props.callBack(newTaskTitle.trim())
            setNewTaskTitle("")
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
                disabled={props.disabled}/>


            <IconButton color='primary' onClick={addItem}>
                <AddBox/>
            </IconButton>
        </div>
    )
})