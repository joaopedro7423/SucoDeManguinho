import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default {
    Query: {
         surveys: async (parent: any, args: any, context: any) => adaptResolver(makeLoadSurveysController(), args, context)
    }
}
