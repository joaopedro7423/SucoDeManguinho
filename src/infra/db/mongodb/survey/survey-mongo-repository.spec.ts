import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answers: 'any_answer'
      },{
        answers: 'other_answer'
      }],
      date: new Date()
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
