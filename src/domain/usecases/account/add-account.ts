export interface AddAccount{
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = { // addicionando manualmente. o manguinho colocou assim pois facilita a leitura
    name: string
    email: string
    password: string
  }
  // Omit<AccountModel,'id'> // ou usar esse helper do type, pegando do account model e retirando o id

  export type Result = boolean
}
