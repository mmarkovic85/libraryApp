export interface Book {
  _id?: string,
  author?: string,
  title?: string,
  year?: string,
  language?: string,
  isAvailable?: boolean
}

export interface Employee {
  _id?: string,
  username?: string,
  password?: string,
  newpass1?: string,
  newpass2?: string,
  name?: string,
  surname?: string,
  email?: string,
  isAdmin?: boolean
}

export interface Membership {
  _id?: string,
  name?: string,
  surname?: string,
  address?: string,
  status?: string,
  books?: Book[];
}

export interface ConfigObj {
  db: {
    uri: string,
    dbName: string
  },
  defaultAdmin: {
    username: string,
    password: string,
    email: string
  }
}

export interface flashMsg {
  type: string,
  message: string
}

export interface DocumentQuery {
  _id: string,
  document?: Employee | Book | Membership
}