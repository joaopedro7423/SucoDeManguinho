import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
    saveSurveyResultParams: SaveSurveyResult.Params

  async save (data: SaveSurveyResult.Params): Promise<void> {
    this.saveSurveyResultParams = data
    return Promise.resolve()
    }
  }

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
   result= mockSurveyResultModel()
    surveyId: string
    accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
    }
  }
