import { AxiosHttpClient } from '@/infra/http'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
    return new AxiosHttpClient() // pq colocar aqui agora? pq se no futuro precisar de uma dependencia so altera aqui.
}
