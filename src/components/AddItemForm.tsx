import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type PropsType = {
    callBack: (title: string) => void

}

export function AddItemForm(props: PropsType) {
    let [newTaskTitle, setNewTaskTitle] = useState("")
    let [error, setError] = useState<string | null>(null)
    const onSetNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.currentTarget.value)
    const onEnterKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
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
            <input value={newTaskTitle}
                   onChange={onSetNewTitleHandler}
                   onKeyPress={onEnterKeyPressHandler}
                   className={error ? "error" : ""}/>
            {error && <div className="error-message">{error}</div>}

            <button onClick={addItem}>+
            </button>
        </div>
    )
}