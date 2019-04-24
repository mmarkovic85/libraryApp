export interface Book {
  _id?: string,
  author: string,
  title: string,
  year: string,
  language: string,
  available?: boolean
}

export interface Employee {
  _id?: string,
  username: string,
  password: string,
  email?: string
}

export interface EmployeeQuery {
  _id?: string,
  username?: string,
  email?: string
}

export interface ConfigObj {
  uri?: string,
  dbName?: string,
  username?: string,
  password?: string
}