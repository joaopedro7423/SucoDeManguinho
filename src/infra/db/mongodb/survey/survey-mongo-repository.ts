import { MongoHelper, QueryBuilder } from '../../mongodb/helpers'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'bson'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    // join na tabela local _id com o surveyResult(tabela) no surveyId(parametro)
    const query = new QueryBuilder()
    .lookup({
      from: 'surveyResults',
      foreignField: 'surveyId',
      localField: '_id',
      as: 'result'
    })
    .project({
      _id: 1,
      question: 1,
      answers: 1,
      date: 1,
      didAnswer: {
        $gte: [{
            $size: {
              $filter: {
            input: '$result',
            as: 'item',
            cond: {
              $eq: ['$$item.accountId', new ObjectId(accountId)]
            }
            }
          }
          }, 1]
        }

      }
    )
    .build()

    const surveys = surveyCollection.aggregate(query).toArray()
    // const surveys: SurveyModel[] = surveyCollection.find().toArray() O manguinho colocou asssim o o dele n estava reconhecendo o tipo
    return MongoHelper.mapCollection(await surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(await survey)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = surveyCollection.findOne({
       _id: new ObjectId(id)
       },{
         projection: {
           _id: 1
         }
       })
    return survey != null
  }
}
