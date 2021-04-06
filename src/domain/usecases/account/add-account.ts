export interface AddAccount{
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = { // addicionando manualmente. o manguinho colocou assim pois facilita a leitura
    name: string
    email: string
    password: string
  }
  export type Result = boolean
}
