import { Controller, HttpRequest, HttpResponse , LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbiden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly SaveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbiden(new InvalidParamError('answer'))
        }
      } else {
        return forbiden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.SaveSurveyResult.save(
        {
          accountId,
          surveyId,
          answer,
          date: new Date()
        }
      )
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
