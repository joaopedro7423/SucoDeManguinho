import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-surveys-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test/mock-survey'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
    addSurveyParams: AddSurveyRepository.Params

  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data
      return Promise.resolve()
    }
  }

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
    result = mockSurveyModel()
    id: string

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
      this.id = id
      return Promise.resolve(this.result)
    }
  }

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
    surveyModels = mockSurveyModels()
    accountId: string

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
      return Promise.resolve(this.surveyModels)
    }
  }
