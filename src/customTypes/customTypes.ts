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
  email?: string,
  isAdmin: boolean
}

export interface EmployeeQuery {
  _id?: string,
  username?: string,
  email?: string
}

export interface ConfigObj {
  db?: {
    uri?: string,
    dbName?: string
  },
  defaultAdmin: {
    username?: string,
    password?: string
  }
}

export interface flashMsg {
  type: string,
  message: string
}