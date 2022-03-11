import axios from "axios";

let instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '162e6d4c-8a79-4dd3-aa4b-44b1d67a752c'
    }

})


export const todolistApi = {
    getTodos() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodo(title: string) {
        return instance.post<BaseResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodo(todolistID: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${todolistID}`)
    },
    updateTodoTitle(title: string, todolistID: string) {
        return instance.put<BaseResponseType>(`todo-lists/${todolistID}`, {title})
    }
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type BaseResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T

}



type GetTasksResponseType =  { items: Array<TaskType> , totalCount: number, error: string}

export enum TaskStatuses  {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3 ,
}

export enum TaskPriorities {
    Low = 0 ,
    Middle = 1 ,
    High = 2,
    Urgently = 3,
    Later= 4 ,
}



export type TaskType = {
    description: string
    id: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    todoListId: string
    order: number
    startDate: string
    deadline: string
    addedDate: string
}

type UpdateTaskModelType = {
    title: string
    description: string
    // completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}