import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/controllers/Login/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/Login/signup/signup-controller-factory'

export default {
    Query: {
         login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
    },
    Mutation: {
        signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
   }
}
