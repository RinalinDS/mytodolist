import {RequestStatusType} from './index'


export type FilterValueType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}