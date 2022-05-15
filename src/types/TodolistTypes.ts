import {TodolistType, RequestStatusType} from './index'



export type FilterValueType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}