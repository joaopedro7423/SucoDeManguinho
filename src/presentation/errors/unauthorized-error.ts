export class UnauthorizedError extends Error {
  constructor () {
    super('Ei, seu bunda mole, vc n tem acesso aqui, o que vc esta fazendu?.')
    this.name = 'UnauthorizedError'
  }
}
