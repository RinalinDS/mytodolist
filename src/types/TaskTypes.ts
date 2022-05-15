import {TaskPriorities, TaskStatuses} from '../enums';
import {RequestStatusType} from './index';

export type TasksType = {
  [key: string]: Array<TaskType>
}

// Тип внизу, создан для того чтобы можно было объединить changeTitle и changeStatus, чтобы они диспатчили
//  один объект в котором будет объект с нужным свойством, либо title, либо status, а все остальные взять по дефолту.
export type UpdateTaskModelDomainType = Partial<UpdateTaskModelType>

export type UpdateTaskModelType = {
  title: string
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
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
  entityStatus: RequestStatusType
}

export type GetTasksResponseType = {
  items: Array<TaskType>
  totalCount: number
  error: string | null
}








