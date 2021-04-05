import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (accountData: AddSurveyRepository.Params) => Promise<void>

}

export namespace AddSurveyRepository{
  export type Params =AddSurvey.Params
}
