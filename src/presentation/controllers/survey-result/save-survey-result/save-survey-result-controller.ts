import { InvalidParamError } from '@/presentation/errors'
import { forbiden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadAnswersBySyrvey: LoadAnswersBySurvey,
    private readonly SaveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request
      const answers = await this.LoadAnswersBySyrvey.loadAnswers(surveyId)
      if (!answers.length) {
        return forbiden(new InvalidParamError('surveyId'))
      } else if (!answers.includes(answer)) {
          return forbiden(new InvalidParamError('answer'))
      }
      const surveyResult = await this.SaveSurveyResult.save(
        {
          accountId,
          surveyId,
          answer,
          date: new Date()
        })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string

  }
  }
