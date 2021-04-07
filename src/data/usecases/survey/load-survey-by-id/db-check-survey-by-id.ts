import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    return this.checkSurveyByIdRepository.checkById(id)
  }
}
