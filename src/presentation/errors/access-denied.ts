export class AccessDeniedError extends Error {
  constructor () {
    super('Você não tem acesso a isso.')
    this.name = 'AccessDeniedError'
  }
}
