import { makeApiUrl } from '@/main/factories/pages/http/api-url-factory'
import { makeAxiosHttpClient } from '@/main/factories/pages/http/axios-http-client-factory'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { Authentication } from '@/domain/usecases/authentication'

export const makeRemoteAuthentication = (): Authentication => {
    return new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient())
}
