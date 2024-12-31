export interface IDataResponse {
  statusCode: number
  message: string
  data?: any
}

export interface IUserToken {
  id: number
  email: string
  passwordVersion: number
}

export interface IFilterQuery {
  searchQuery: string
  sortField: string
  sortOrder: string
}

export interface IPaginationQuery {
  page: number
  limit: number
}
