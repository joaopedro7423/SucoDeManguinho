export class ServerError extends Error {
  constructor () {
    super('A Porra do servidor caiu seu merda, a caralha do manguinho que pediu para colocar a merda de uma mensagem amigavel seu lixo.')
    this.name = 'ServerError'
  }
}
