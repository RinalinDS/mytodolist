import axios from "axios";
import {
    AuthMeResponseType,
    BaseResponseType,
    GetTasksResponseType,
    LoginParamsType,
    TaskType,
    TodolistType,
    UpdateTaskModelType
} from '../types';

let instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '162e6d4c-8a79-4dd3-aa4b-44b1d67a752c'
    }

})

// api

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
    },
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    },
    updateTask(todolistID: string, taskID: string, model: UpdateTaskModelType) {
        return instance.put<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks/${taskID}`, model)
    },
    createTask(todolistID: string, title: string) {
        return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title})
    }
}

export const authAPI = {
    login(data:LoginParamsType) {
        return instance.post<BaseResponseType<{userId: number}>>(`auth/login`, data)
    },
    logout() {
        return instance.delete<BaseResponseType>(`auth/login`)
    },
    me() {
        return instance.get<BaseResponseType<AuthMeResponseType>>(`auth/me`)
    }

}


