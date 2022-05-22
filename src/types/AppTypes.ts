export type NullableType<T> = null | T

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type BaseResponseType<T = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldsErrorsType[]
  data: T
}

export type FieldsErrorsType = { field: string, error: string };
export type RejectValueType = { rejectValue: { errors: Array<string>, fieldsError?: FieldsErrorsType[] } }