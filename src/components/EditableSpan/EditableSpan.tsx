import React, {ChangeEvent, memo, useState} from "react";
import TextField from "@material-ui/core/TextField";

type propsType = {
    title: string
    onChange: (newValue: string) => void
    disabled? : boolean
}

export const EditableSpan = memo((props: propsType) => {


    let [edit, setEdit] = useState(false)
    let [title, setTitle] = useState(props.title)

    const onDoubleClickHandler = () => {
        setEdit(true)
    }

    const onBlurHandler = () => {

        setEdit(false)
        props.onChange(title)
    }

    const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return (
        edit
           ? <TextField variant='outlined' size='small' value={title} onBlur={onBlurHandler}
                       disabled={props.disabled} autoFocus onChange={onSetNewTitleHandler}/>
         : <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>

    )
})