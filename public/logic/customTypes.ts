namespace customTypes {
  export interface Book {
    _id?: string,
    author?: string,
    title?: string,
    year?: string,
    language?: string,
    available?: boolean
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

  export interface flashMsg {
    type: string,
    message: string
  }
}