import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type propsType = {
    title: string
    onChange: (newValue: string) => void
}



export function EditableSpan(props: propsType) {
    let [edit, setEdit] = useState(false)
    let [title, setTitle] = useState(props.title)
    const onDoubleClickHandler = () => {
        setEdit(true)
        setTitle(props.title)
    }

    const onBlurHandler = () => {
        setEdit(false)
        props.onChange(title)
    }
    const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return (
        edit
           ? <TextField variant='outlined' size='small' value={title} onBlur={onBlurHandler} autoFocus onChange={onSetNewTitleHandler}/>
         : <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>

    )
}